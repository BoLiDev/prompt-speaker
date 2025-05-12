/** @format */

import { useConfigStore } from "@src/stores";
import cx from "classnames";

export function ConfigBtn() {
  const configStore = useConfigStore();

  return (
    <button
      className={cx(
        "flex items-center justify-center p-2 rounded-full ml-2",
        "bg-slate-600 hover:bg-slate-800",
        "transition-colors duration-200 border border-gray-200",
      )}
      onClick={() => configStore.toggle()}
    >
      <img src="/svg/settings.svg" alt="Settings" className="w-4 h-4" />
    </button>
  );
}
