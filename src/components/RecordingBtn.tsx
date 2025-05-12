/** @format */

import { observer } from "mobx-react-lite";
import { useLiveTranscriptionStore } from "@src/stores";

import cx from "classnames";

export const RecordingBtn: React.FC = observer(() => {
  const liveTranscriptionStore = useLiveTranscriptionStore();

  const getBtnText = () => {
    if (liveTranscriptionStore.isActive) {
      return "Stop Recording";
    }

    return "Start Recording";
  };

  const getBtnIcon = () => {
    if (liveTranscriptionStore.isActive) {
      return "/svg/stop.svg";
    }

    if (liveTranscriptionStore.isPreparing) {
      return "/svg/loading.svg";
    }

    return "/svg/mic.svg";
  };

  const getIconClassName = () => {
    if (liveTranscriptionStore.isPreparing) {
      return "w-4 h-4 mr-2 animate-spin";
    }

    return "w-4 h-4 mr-2";
  };

  return (
    <button
      className={cx(
        "flex items-center justify-center py-1 px-3 rounded-lg",
        liveTranscriptionStore.isActive
          ? "bg-red-500 hover:bg-red-600"
          : "bg-purple-500 hover:bg-purple-600",
        "text-white font-medium transition-colors duration-200 nunito",
      )}
      onClick={() => liveTranscriptionStore.toggle()}
    >
      <img src={getBtnIcon()} className={getIconClassName()} />
      {getBtnText()}
    </button>
  );
});
