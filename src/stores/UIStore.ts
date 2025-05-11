/** @format */

import { makeAutoObservable } from "mobx";
import { RootStore } from "./RootStore";
import { LiveTranscriptionStore } from "./LiveTranscriptionStore";

export enum RecordingMode {
  BATCH = "batch",
  LIVE = "live",
}

export class UIStore {
  public activeView: "recording" | "refining" = "recording";
  public isRefining: boolean = false;
  public refinedText: string = "";
  public recordingMode: RecordingMode = RecordingMode.BATCH;

  private liveTranscriptionStore: LiveTranscriptionStore;
  private rootStore: RootStore;

  /**
   * Creates a new UIStore instance
   * @param speechToTextStore Reference to SpeechToTextStore for accessing transcription data
   */
  constructor(
    liveTranscriptionStore: LiveTranscriptionStore,
    rootStore: RootStore,
  ) {
    makeAutoObservable(this);
    this.liveTranscriptionStore = liveTranscriptionStore;
    this.rootStore = rootStore;
  }

  /**
   * Set the recording mode
   * @param mode Recording mode
   */
  public setRecordingMode(mode: RecordingMode): void {
    if (this.recordingMode === mode) return;

    if (
      mode === RecordingMode.BATCH &&
      this.recordingMode === RecordingMode.LIVE
    ) {
      this.rootStore.liveTranscriptionStore.dispose();
    }

    this.recordingMode = mode;
  }

  /**
   * Switch to live mode
   */
  public switchToLiveMode(): void {
    this.setRecordingMode(RecordingMode.LIVE);
  }

  /**
   * Switch to batch mode
   */
  public switchToBatchMode(): void {
    this.setRecordingMode(RecordingMode.BATCH);
  }

  /**
   * Check if the current mode is live
   */
  public get isLiveMode(): boolean {
    return this.recordingMode === RecordingMode.LIVE;
  }

  /**
   * Switches to the refinement view and begins refinement process
   */
  public moveToRefinement(): void {
    this.activeView = "refining";
    this.isRefining = true;

    setTimeout(() => {
      this.refinedText = this.liveTranscriptionStore.transcript;
      this.isRefining = false;
    }, 2000);
  }

  /**
   * Switches to the recording view
   */
  public moveToRecording(): void {
    this.activeView = "recording";
  }

  /**
   * Resets the UI store to its initial state
   */
  public reset(): void {
    this.activeView = "recording";
    this.isRefining = false;
    this.refinedText = "";
    this.recordingMode = RecordingMode.BATCH;
  }
}
