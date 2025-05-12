/** @format */

import cx from "classnames";
import { ConfigBtn } from "./ConfigBtn";
import { observer } from "mobx-react-lite";
import { RecordingBtn } from "./RecordingBtn";

export const RecordingPanel: React.FC<{
  className?: string;
}> = observer(({ className }) => {
  return (
    <div className={cx("p-8 flex items-center justify-center", className)}>
      <div className={cx("space-y-4 w-full")}>
        <div className={cx("flex-0 flex items-center")}>
          <div className={cx("text-3xl text-gray-800 nunito font-extrabold")}>
            Prompt Studio
          </div>
        </div>

        <p className={cx("text-gray-500 text-sm nunito leading-5")}>
          Let the AI transform your thoughts into error-free, well-structured
          prompts.
        </p>

        <div className={cx("flex items-center")}>
          <RecordingBtn />
          <ConfigBtn />
        </div>
      </div>
    </div>
  );
});
