/** @format */

import TransitionContainer from "@src/components/TransitionContainer";
import RecordingView from "@src/components/RecordingView";
import RefinementView from "@src/components/RefinementView";
import ConfigPanel from "@src/components/ConfigPanel";
import ConfigButton from "@src/components/ConfigPanel/ConfigButton";
import CustomTitleBar from "@src/components/CustomTitleBar";
import { rootStore, StoreContext } from "@src/stores";

function App() {
  return (
    <StoreContext.Provider value={rootStore}>
      <div className="min-h-screen bg-slate-100 flex flex-col">
        <CustomTitleBar />
        <ConfigButton className="absolute right-3 bottom-3" />

        <div className="h-full">
          <TransitionContainer>
            <RecordingView />
            <RefinementView />
          </TransitionContainer>
        </div>
      </div>

      <ConfigPanel />
    </StoreContext.Provider>
  );
}

export default App;
