/** @format */

import ConfigPanel from "@src/components/ConfigPanel";
import ConfigButton from "@src/components/ConfigPanel/ConfigButton";
import CustomTitleBar from "@src/components/CustomTitleBar";
import { V1UI } from "./components/v1";
import { rootStore, StoreContext } from "@src/stores";

function App() {
  return (
    <StoreContext.Provider value={rootStore}>
      <div className="min-h-screen bg-slate-100 flex flex-col">
        <CustomTitleBar />
        <ConfigButton className="absolute right-3 bottom-3" />

        <V1UI />
      </div>

      <ConfigPanel />
    </StoreContext.Provider>
  );
}

export default App;
