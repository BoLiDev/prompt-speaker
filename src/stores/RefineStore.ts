/** @format */

import { makeAutoObservable, reaction } from "mobx";
import { generateRefinement } from "@src/AI";
import { getUserErrorMessage, logError } from "@src/utils";
import { LiveTranscriptionStore } from "./LiveTranscriptionStore";
import { RootStore } from "./RootStore";

export class RefineStore {
  public isRefining: boolean = false;
  public refinementError: string | null = null;
  public refinedText: string = "";

  private liveTranscriptionStore: LiveTranscriptionStore;
  private rootStore?: RootStore;

  /**
   * Creates a new RefineStore instance
   * @param speechToTextStore Reference to SpeechToTextStore for transcript data
   * @param rootStore Optional reference to RootStore for configuration access
   */
  constructor(
    liveTranscriptionStore: LiveTranscriptionStore,
    rootStore?: RootStore,
  ) {
    makeAutoObservable(this);
    this.liveTranscriptionStore = liveTranscriptionStore;
    this.rootStore = rootStore;

    reaction(
      () => liveTranscriptionStore.state,
      () => {
        this.reset();
      },
    );
  }

  /**
   * Generate a refined version of the transcribed text
   */
  public async refineTranscription(): Promise<void> {
    const transcription = this.liveTranscriptionStore.transcript;

    if (!transcription || transcription.trim() === "") {
      this.refinementError = "No transcription available to refine";
      return;
    }

    this.isRefining = true;
    this.refinementError = null;

    try {
      // Get gemini API key from config store if available
      const geminiApiKey = this.rootStore?.configStore.getGeminiApiKey();
      this.refinedText = await generateRefinement(transcription, geminiApiKey);
    } catch (error) {
      logError("Text refinement error", error);
      this.refinementError = getUserErrorMessage(
        error,
        "Failed to refine text",
      );
    } finally {
      this.isRefining = false;
    }
  }

  /**
   * Reset refinement state
   */
  public reset(): void {
    this.isRefining = false;
    this.refinementError = null;
    this.refinedText = "";
  }

  /**
   * Get original transcription text
   */
  public get originalText(): string {
    return this.liveTranscriptionStore.transcript;
  }

  /**
   * Determine if there is a valid original text to refine
   */
  public get hasOriginalText(): boolean {
    return (
      !!this.liveTranscriptionStore.transcript &&
      this.liveTranscriptionStore.transcript.trim().length > 0
    );
  }
}
