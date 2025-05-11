/** @format */

import { createContext, useContext } from "react";
import { RootStore } from "./RootStore";
import { UIStore } from "./UIStore";
import { RefineStore } from "./RefineStore";
import { LiveTranscriptionStore } from "./LiveTranscriptionStore";
import { ConfigStore } from "./ConfigStore";

const rootStore = new RootStore();

const StoreContext = createContext<RootStore>(rootStore);

export function useStores() {
  return useContext(StoreContext);
}

export function useUIStore() {
  const { uiStore } = useStores();
  return uiStore;
}

export function useRefineStore() {
  const { refineStore } = useStores();
  return refineStore;
}

export function useLiveTranscriptionStore() {
  const { liveTranscriptionStore } = useStores();
  return liveTranscriptionStore;
}

export function useConfigStore() {
  const { configStore } = useStores();
  return configStore;
}

export { StoreContext };
export { rootStore };
export { RootStore, UIStore, RefineStore, LiveTranscriptionStore, ConfigStore };
export default rootStore;
