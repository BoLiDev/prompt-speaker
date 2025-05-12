/** @format */

import CustomTitleBar from "@src/components/CustomTitleBar";

// import { V1UI } from "@src/components/v1";
import { V2UI } from "./v2-components";
import { rootStore, StoreContext } from "@src/stores";

function App() {
  return (
    <StoreContext.Provider value={rootStore}>
      <div className="min-h-screen bg-slate-100  flex flex-col">
        <CustomTitleBar />
        <V2UI />
      </div>
    </StoreContext.Provider>
  );
}

export default App;
