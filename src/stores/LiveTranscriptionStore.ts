/** @format */

import { makeAutoObservable } from "mobx";
import { LiveTranscriptionService } from "@src/AI";
import { getUserErrorMessage, logError } from "@src/utils";
import { AudioRecorder } from "@src/audio";
import { ConfigStore } from "./ConfigStore";

/**
 * Live Transcription State Enum
 */
enum LiveTranscriptionState {
  IDLE = "INACTIVE",
  ACTIVE = "ACTIVE",
  ERROR = "ERROR",
  PREPARING = "PREPARING",
}

/**
 * Live Transcription Management Store
 */
export class LiveTranscriptionStore {
  public state: LiveTranscriptionState = LiveTranscriptionState.IDLE;
  public transcript: string = "";
  public error: string | null = null;
  private transcriptionService: LiveTranscriptionService | null = null;
  private audioRecorder: AudioRecorder | null = null;
  private configStore: ConfigStore;

  /**
   * Create Live Transcription Store
   */
  constructor(configStore: ConfigStore) {
    this.configStore = configStore;
    makeAutoObservable(this);
  }

  /**
   * Get Live Transcription State - Active status
   * @returns Whether transcription is active
   */
  public get isActive(): boolean {
    return this.state === LiveTranscriptionState.ACTIVE;
  }

  /**
   * Get Live Transcription State - Preparing status
   * @returns Whether transcription is preparing
   */
  public get isPreparing(): boolean {
    return this.state === LiveTranscriptionState.PREPARING;
  }

  /**
   * Get Live Transcription State - Error status
   * @returns Whether transcription is in error state
   */
  public get isError(): boolean {
    return this.state === LiveTranscriptionState.ERROR;
  }

  /**
   * Get Live Transcription State - Idle status
   * @returns Whether transcription is idle
   */
  public get isIdle(): boolean {
    return this.state === LiveTranscriptionState.IDLE;
  }

  public toggle(): void {
    if (
      this.state === LiveTranscriptionState.PREPARING ||
      this.state === LiveTranscriptionState.ACTIVE
    ) {
      console.log("Stopping recording");
      this.stopRecording();
    } else {
      console.log("Starting recording");
      this.startRecording();
    }
  }

  /**
   * Start Recording and Live Transcription
   */
  public startRecording(): void {
    if (this.state === LiveTranscriptionState.ACTIVE) {
      return;
    }

    this.state = LiveTranscriptionState.PREPARING;
    this.transcript = "";
    this.error = null;

    try {
      this.startLiveTranscription();
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Stop Recording and Live Transcription
   */
  public stopRecording(): void {
    this.stopLiveTranscription();
    this.state = LiveTranscriptionState.IDLE;
  }

  /**
   * Clean Up Resources
   */
  public dispose(): void {
    this.stopLiveTranscription();
    this.transcript = "";
    this.error = null;
    this.state = LiveTranscriptionState.IDLE;
  }

  /**
   * Start Live Transcription
   */
  private async startLiveTranscription(): Promise<void> {
    if (this.state === LiveTranscriptionState.ACTIVE) {
      return;
    }

    try {
      const apiKey = this.configStore.openAIKey;

      if (!apiKey) {
        this.handleError(
          new Error(
            "OpenAI API key is not set. Please configure it in settings.",
          ),
        );
        this.configStore.openConfig();
        return;
      }

      this.transcriptionService = new LiveTranscriptionService(
        {
          onTranscript: this.handleTranscript,
          onError: this.handleError,
          onEnd: this.handleEnd,
        },
        {
          apiKey: apiKey,
          prefix_padding_ms: this.configStore.prefixPadding,
          silence_duration_ms: this.configStore.silenceDuration,
          threshold: this.configStore.vadThreshold,
          model: this.configStore.model,
        },
      );

      this.audioRecorder = new AudioRecorder();
      this.audioRecorder.onAudioData((audioData) => {
        if (this.transcriptionService) {
          this.transcriptionService.sendAudio(audioData);
        }
      });

      await this.transcriptionService.start();
      await this.audioRecorder.start();

      this.state = LiveTranscriptionState.ACTIVE;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Stop Live Transcription
   */
  private stopLiveTranscription(): void {
    if (
      this.state !== LiveTranscriptionState.ACTIVE &&
      this.state !== LiveTranscriptionState.PREPARING
    ) {
      return;
    }

    if (this.audioRecorder) {
      try {
        this.audioRecorder.stop();
        this.audioRecorder = null;
      } catch (error) {
        console.error(
          "[LiveTranscriptionStore] Error stopping audio recorder:",
          error,
        );
      }
    }

    if (this.transcriptionService) {
      try {
        this.transcriptionService.stop();
        this.transcriptionService = null;
      } catch (error) {
        console.error(
          "[LiveTranscriptionStore] Error stopping transcription service:",
          error,
        );
      }
    }
  }

  /**
   * Reset State
   */
  public reset(): void {
    this.stopLiveTranscription();
    this.transcript = "";
    this.error = null;
    this.state = LiveTranscriptionState.IDLE;
  }

  /**
   * Handle Received Transcript Text
   * @param text - Transcript Text
   * @param isFinal - Whether it is the final text
   */
  private handleTranscript = (text: string, isFinal: boolean): void => {
    if (isFinal) this.transcript += text;
  };

  /**
   * Handle Error (general error handler for transcription and fatal recorder issues)
   * @param error - Error object
   */
  private handleError = (error: unknown): void => {
    let errorMessage: Error =
      error instanceof Error ? error : new Error(String(error));
    if (error instanceof DOMException && error.name === "NotAllowedError") {
      errorMessage = new Error(
        "Microphone access denied, please grant microphone permission and try again",
      );
    } else if (
      error instanceof DOMException &&
      error.name === "NotFoundError"
    ) {
      errorMessage = new Error(
        "Microphone device not found, please ensure the microphone is correctly connected",
      );
    } else if (error instanceof Error) {
      errorMessage = error;
    } else {
      errorMessage = new Error(String(error));
    }

    logError("Live transcription error", errorMessage);
    this.error = getUserErrorMessage(errorMessage, "Live transcription error");
    this.state = LiveTranscriptionState.ERROR;

    this.stopLiveTranscription();
  };

  /**
   * Handle Transcription End
   */
  private handleEnd = (): void => {
    if (this.state !== LiveTranscriptionState.ERROR) {
      this.state = LiveTranscriptionState.IDLE;
    }
  };
}
