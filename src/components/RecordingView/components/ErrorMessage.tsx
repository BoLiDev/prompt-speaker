/** @format */

import { observer } from "mobx-react-lite";
import { useLiveTranscriptionStore } from "@src/stores";

const ErrorMessage = observer(() => {
  const liveTranscriptionStore = useLiveTranscriptionStore();
  const errorMessage = liveTranscriptionStore.error;

  if (!errorMessage) return null;

  return (
    <div className="w-full max-w-2xl bg-red-900 rounded-lg p-4 mb-6">
      <h3 className="text-lg font-medium text-red-200 mb-2">Error</h3>
      <div className="p-3 bg-red-800 rounded text-red-100">{errorMessage}</div>
    </div>
  );
});

export default ErrorMessage;
