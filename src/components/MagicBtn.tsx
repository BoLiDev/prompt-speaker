/** @format */

import { useCallback } from "react";
import { observer } from "mobx-react-lite";
import cx from "classnames";

import { useLiveTranscriptionStore, useRefineStore } from "@src/stores";

import magicWandIcon from "../../public/svg/magic-wand.svg";
import loadingIcon from "../../public/svg/loading.svg";

export const MagicBtn: React.FC<{ className?: string }> = observer(
  ({ className }) => {
    const liveTranscriptionStore = useLiveTranscriptionStore();
    const refineStore = useRefineStore();

    const refineBtnEnabled =
      liveTranscriptionStore.isIdle &&
      !refineStore.isRefining &&
      refineStore.hasOriginalText;

    const handleRefine = useCallback(() => {
      if (!refineBtnEnabled) {
        return;
      }

      refineStore.refineTranscription();
    }, [refineBtnEnabled, refineStore]);

    return (
      <button
        className={cx(
          "flex items-center justify-center p-3 rounded-full non-selectable",
          "bg-purple-500 text-white",
          "transition-colors duration-200 shadow-md",
          className,
          {
            "opacity-50": !refineBtnEnabled,
            "hover:bg-purple-600": refineBtnEnabled,
          },
        )}
        disabled={!refineBtnEnabled}
        onClick={handleRefine}
      >
        {refineStore.isRefining ? (
          <img
            src={loadingIcon}
            alt="Loading"
            className="w-5 h-5 animate-spin"
          />
        ) : (
          <img src={magicWandIcon} alt="Magic Wand" className="w-5 h-5" />
        )}
      </button>
    );
  },
);
