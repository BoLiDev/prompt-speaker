/** @format */

import { UIStore } from "./UIStore";
import { RefineStore } from "./RefineStore";
import { LiveTranscriptionStore } from "./LiveTranscriptionStore";
import { ConfigStore } from "./ConfigStore";

export class RootStore {
  public uiStore: UIStore;
  public refineStore: RefineStore;
  public liveTranscriptionStore: LiveTranscriptionStore;
  public configStore: ConfigStore;

  /**
   * Creates a new RootStore instance that coordinates all other stores
   */
  constructor() {
    this.configStore = new ConfigStore();
    this.liveTranscriptionStore = new LiveTranscriptionStore(this.configStore);
    this.refineStore = new RefineStore(
      this.liveTranscriptionStore,
      this.configStore,
    );
    this.uiStore = new UIStore(this.liveTranscriptionStore, this);
  }

  /**
   * Resets all stores to their initial state
   */
  public resetAll(): void {
    this.liveTranscriptionStore.reset();
    this.uiStore.reset();
    this.refineStore.reset();
    this.liveTranscriptionStore.dispose();
  }
}
