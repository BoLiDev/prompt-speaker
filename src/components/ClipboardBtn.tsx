/** @format */

import { copyToClipboard } from "@src/utils";
import cx from "classnames";

export const ClipboardBtn: React.FC<{
  className?: string;
  text: string;
}> = ({ className, text }) => {
  return (
    <button
      className={cx(
        className,
        "flex items-center justify-center p-3 rounded-full non-selectable",
        "bg-slate-500 hover:bg-gray-700",
        "transition-colors duration-200",
      )}
      aria-label="Copy to clipboard"
      onClick={() => {
        copyToClipboard(text);
      }}
    >
      <img src="/svg/clipboard.svg" alt="Copy" className="w-5 h-5" />
    </button>
  );
};
