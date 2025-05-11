/** @format */

import React from "react";
import { observer } from "mobx-react-lite";
import { useRefineStore } from "@src/stores";
import { copyToClipboard } from "@src/utils/copyboard";

const OriginalTranscription: React.FC = observer(() => {
  const refineStore = useRefineStore();
  const originalText = refineStore.originalText;

  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium text-slate-300 mb-2 flex justify-between">
        <span>Original transcription</span>
        <button
          onClick={() => copyToClipboard(originalText)}
          className="text-sm text-slate-400 hover:text-slate-200"
        >
          Copy
        </button>
      </h3>
      <div className="p-4 bg-slate-700 rounded-lg text-slate-200">
        {originalText || (
          <span className="text-slate-400 italic">
            No transcription available
          </span>
        )}
      </div>
    </div>
  );
});

export default OriginalTranscription;
