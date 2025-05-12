/** @format */

import cx from "classnames";

import { RecordingPanel } from "./RecordingPanel";
import { MagicPanel } from "./MagicPanel";
import { ConfigPanel } from "./ConfigPanel";

export const V2UI: React.FC = () => {
  return (
    <div className={cx("app-container p-9 pt-0 flex w-full")}>
      <div className={cx("flex w-full")}>
        <RecordingPanel className="flex-2" />
        <MagicPanel className="flex-3" />
      </div>
      <ConfigPanel />
    </div>
  );
};
