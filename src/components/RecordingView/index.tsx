/** @format */

import React from "react";
import { observer } from "mobx-react-lite";
import { LiveTranscription } from "./components";
import ErrorMessage from "./components/ErrorMessage";

type RecordingViewProps = {
  onComplete?: () => void;
};

/**
 * RecordingView component - The recording interface
 */
const RecordingView: React.FC<RecordingViewProps> = observer(
  ({ onComplete }) => {
    return (
      <div className="flex flex-col h-full p-6 bg-slate-900">
        <div className="flex-1 flex flex-col items-center justify-center">
          <LiveTranscription onComplete={onComplete} />
          <ErrorMessage />
        </div>
      </div>
    );
  },
);

export default RecordingView;
