/**
 * OpenAI Transcription Module
 * Provides a high-level API for real-time audio transcription using OpenAI.
 *
 * @format
 */

import {
  LiveTranscriptionCallbacks,
  LiveTranscriptionConfig,
  OpenAIDeltaMessage,
  OpenAIErrorMessage,
  OpenAIMessageBase,
  OpenAITranscriptionCompletedMessage,
} from "./interface";

/**
 * Class for real-time audio transcription using OpenAI API
 * Manages the entire transcription process from audio capture to text output
 */
class LiveTranscriptionService {
  private webSocket: WebSocket | null = null;
  private config: LiveTranscriptionConfig;
  private callbacks: LiveTranscriptionCallbacks;
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts: number;
  private isManualStop: boolean = false;
  private isActive: boolean = false;
  private apiKey: string;

  /**
   * Creates an instance of LiveTranscription
   * @param callbacks - Callback functions for transcription events
   * @param config - Configuration options for the transcription service
   */
  public constructor(
    callbacks: LiveTranscriptionCallbacks,
    config: LiveTranscriptionConfig = {},
  ) {
    this.config = config;
    this.callbacks = callbacks;
    this.maxReconnectAttempts = config.maxReconnectAttempts || 3;
    this.apiKey = config.apiKey || "";

    if (!this.apiKey) {
      throw new Error("OpenAI API key is required");
    }
  }

  /**
   * Starts the transcription process
   */
  public async start(): Promise<void> {
    if (this.isActive || this.webSocket) {
      return;
    }

    this.isManualStop = false;
    this.reconnectAttempts = 0;

    try {
      await this.setupConnection();
      this.isActive = true;
    } catch (error) {
      this.callbacks.onError(
        error instanceof Error ? error : new Error(String(error)),
      );
      await this.stop();
    }
  }

  /**
   * Stops the transcription process
   */
  public async stop(): Promise<void> {
    if (!this.isActive && !this.webSocket) {
      return;
    }

    this.isManualStop = true;

    if (this.webSocket) {
      if (
        this.webSocket.readyState === WebSocket.OPEN ||
        this.webSocket.readyState === WebSocket.CONNECTING
      ) {
        this.webSocket.close(1000, "Client requested stop");
      }
      this.webSocket = null;
    }

    this.cleanup();

    if (!this.isManualStop) {
      this.callbacks.onEnd();
    }
  }

  /**
   * Sends audio data to the OpenAI API
   * @param audioBase64 - Base64 encoded audio data
   */
  public sendAudio(audioBase64: string): void {
    this.sendAudioData(audioBase64);
  }

  /**
   * Returns the session configuration for OpenAI API
   * @returns Session configuration object
   */
  private get sessionConfig() {
    return {
      type: "transcription_session.update",
      session: {
        input_audio_transcription: {
          model: this.config.model || "gpt-4o-transcribe",
          language: this.config.language || "en",
        },
        turn_detection: {
          prefix_padding_ms: 100,
          silence_duration_ms: 200,
          type: "server_vad",
          threshold: 0.5,
        },
      },
    };
  }

  /**
   * Sets up the WebSocket connection to OpenAI
   */
  private async setupConnection(): Promise<void> {
    try {
      this.webSocket = new WebSocket(
        `wss://api.openai.com/v1/realtime?intent=transcription`,
        [
          "realtime",
          `openai-insecure-api-key.${this.apiKey}`,
          "openai-beta.realtime-v1",
        ],
      );

      this.webSocket.onopen = this.handleOpen;
      this.webSocket.onmessage = this.handleMessage;
      this.webSocket.onerror = this.handleError;
      this.webSocket.onclose = this.handleClose;
    } catch (error) {
      throw new Error(
        `Failed to establish WebSocket connection: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }

  /**
   * Handles WebSocket open event
   */
  private handleOpen = (): void => {
    this.reconnectAttempts = 0;
    this.webSocket?.send(JSON.stringify(this.sessionConfig));
  };

  /**
   * Handles WebSocket message event
   * @param event - Message event from WebSocket
   */
  private handleMessage = (event: MessageEvent): void => {
    if (typeof event.data !== "string") return;

    try {
      const data = JSON.parse(event.data) as OpenAIMessageBase;

      if (data.type === "conversation.item.input_audio_transcription.delta") {
        const deltaMessage = data as OpenAIDeltaMessage;
        if (deltaMessage.delta) {
          this.callbacks.onTranscript(deltaMessage.delta, false);
        }
      } else if (
        data.type === "conversation.item.input_audio_transcription.completed"
      ) {
        const completedMessage = data as OpenAITranscriptionCompletedMessage;
        if (completedMessage.transcript) {
          this.callbacks.onTranscript(completedMessage.transcript, true);
        }
      } else if (data.type === "error") {
        const errorMessage = data as OpenAIErrorMessage;
        this.handleTranscriberError(
          errorMessage.error?.message || "Unknown error from OpenAI",
        );
      }
    } catch (error) {
      console.error(
        "[OpenAISpeechToText] Error parsing WebSocket message:",
        error,
      );
    }
  };

  /**
   * Handles WebSocket error event
   * @param event - Error event from WebSocket
   */
  private handleError = (event: Event): void => {
    console.error("[OpenAISpeechToText] WebSocket error:", event);
    this.handleTranscriberError("WebSocket error");
  };

  /**
   * Handles WebSocket close event
   * @param event - Close event from WebSocket
   */
  private handleClose = (event: CloseEvent): void => {
    if (!this.isManualStop && event.code !== 1000) {
      this.reconnect();
    }
  };

  /**
   * Handles transcriber errors
   * @param message - Error message
   */
  private handleTranscriberError(message: string): void {
    this.callbacks.onError(new Error(message));
    this.stop().catch((e) =>
      console.error("[OpenAISpeechToText] Error during stop after error:", e),
    );
  }

  /**
   * Sends audio data to the OpenAI API
   * @param audioBase64 - Base64 encoded audio data
   */
  private sendAudioData(audioBase64: string): void {
    if (this.webSocket?.readyState === WebSocket.OPEN) {
      this.webSocket.send(
        JSON.stringify({
          type: "input_audio_buffer.append",
          audio: audioBase64,
        }),
      );
    }
  }

  /**
   * Cleans up resources
   */
  private cleanup(): void {
    this.isActive = false;
  }

  /**
   * Attempts to reconnect to the OpenAI API
   */
  private async reconnect(): Promise<void> {
    if (this.reconnectAttempts++ < this.maxReconnectAttempts) {
      await new Promise((resolve) =>
        setTimeout(resolve, 1000 * this.reconnectAttempts),
      );
      await this.start();
    } else {
      this.handleTranscriberError(
        "Failed to reconnect after multiple attempts.",
      );
    }
  }
}

// Re-export types
export type { LiveTranscriptionCallbacks, LiveTranscriptionConfig };
export { LiveTranscriptionService };
