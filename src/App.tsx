/** @format */

import cx from "classnames";
import {
  ConfigPanel,
  MagicPanel,
  RecordingPanel,
  TitleBar,
} from "@src/components";

import { rootStore, StoreContext } from "@src/stores";

function App() {
  return (
    <StoreContext.Provider value={rootStore}>
      <div className="min-h-screen bg-slate-100  flex flex-col">
        <TitleBar className="non-selectable" />
        <div className={cx("app-container p-9 pt-0 flex w-full")}>
          <div className={cx("flex w-full")}>
            <RecordingPanel className="flex-2 non-selectable" />
            <MagicPanel className="flex-3" />
          </div>
        </div>
      </div>
      <ConfigPanel />
    </StoreContext.Provider>
  );
}

export default App;
