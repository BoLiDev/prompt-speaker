/** @format */

import React from "react";
import { observer } from "mobx-react-lite";
import { useRefineStore } from "@src/stores";
import { copyToClipboard } from "@src/utils";

interface ActionButtonsProps {
  onBack?: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = observer(({ onBack }) => {
  const refineStore = useRefineStore();
  const { isRefining, refinedText, hasOriginalText } = refineStore;

  // No actions during refinement
  if (isRefining) return null;

  return (
    <div className="mt-6 flex justify-center">
      {refinedText ? (
        <button
          onClick={() => copyToClipboard(refinedText)}
          className="mx-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors shadow-md"
        >
          Copy refined result
        </button>
      ) : hasOriginalText ? (
        <button
          onClick={() => refineStore.refineTranscription()}
          className="mx-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors shadow-md"
        >
          Refine text
        </button>
      ) : null}

      <button
        onClick={onBack}
        className="mx-2 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-md transition-colors shadow-md"
      >
        Return to recording
      </button>
    </div>
  );
});

export default ActionButtons;
