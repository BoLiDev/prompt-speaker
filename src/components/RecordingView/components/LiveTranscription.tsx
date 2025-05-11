/** @format */

import React from "react";
import { observer } from "mobx-react-lite";
import { useLiveTranscriptionStore } from "@src/stores";
import { copyToClipboard } from "@src/utils";

interface LiveTranscriptionProps {
  onComplete?: () => void;
}

/**
 * LiveTranscription Component
 * A pure UI component that only renders and handles user interactions
 */
const LiveTranscription: React.FC<LiveTranscriptionProps> = observer(
  ({ onComplete }) => {
    const liveTranscriptionStore = useLiveTranscriptionStore();

    const text = liveTranscriptionStore.transcript;
    const errorText = liveTranscriptionStore.error;

    const handleStartRecording = () => {
      liveTranscriptionStore.startRecording();
    };

    const handleStopRecording = () => {
      liveTranscriptionStore.stopRecording();
    };

    const handleCopyText = () => {
      copyToClipboard(liveTranscriptionStore.transcript);
    };

    const handleContinue = () => {
      if (onComplete) {
        onComplete();
      }
    };

    const renderPrimaryButton = () => {
      if (liveTranscriptionStore.isActive) {
        return (
          <button
            onClick={handleStopRecording}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors shadow-md"
          >
            Stop Recording
          </button>
        );
      }

      if (liveTranscriptionStore.isPreparing) {
        return (
          <button
            onClick={handleStopRecording} // Allow stopping during preparation
            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md transition-colors shadow-md flex items-center"
          >
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Preparing (can stop)
          </button>
        );
      }

      if (liveTranscriptionStore.isError) {
        <button
          onClick={handleStopRecording} // stopRecording in store resets to IDLE
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors shadow-md"
        >
          Error (click to reset)
        </button>;
      }

      if (liveTranscriptionStore.isIdle) {
        return (
          <button
            onClick={handleStartRecording}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors shadow-md flex items-center"
          >
            Start Recording
          </button>
        );
      }
    };

    const getPlaceholderText = () => {
      if (liveTranscriptionStore.transcript) return null;

      if (liveTranscriptionStore.isIdle) {
        return "Click the Start Recording button to begin real-time transcription";
      }

      if (liveTranscriptionStore.isPreparing) {
        return "Preparing recording, please wait...";
      }

      if (liveTranscriptionStore.isActive) {
        return "Recording, waiting for transcription results...";
      }

      if (liveTranscriptionStore.isError) {
        return "Please wait...";
      }

      return "Please wait...";
    };

    // Determine if the Continue button should be shown
    const showContinueButton =
      liveTranscriptionStore.isIdle && text && text.length > 0;

    return (
      <div className="w-full max-w-2xl bg-slate-800 rounded-lg p-4 mb-6">
        <div className="mb-4 flex justify-between items-center">
          <h3 className="text-lg font-medium text-slate-300">Speech to Text</h3>
          <div className="flex space-x-2">
            {renderPrimaryButton()}
            <button
              onClick={handleCopyText}
              disabled={!text}
              className={`px-4 py-2 border rounded-md transition-colors shadow-md ${
                text
                  ? "bg-slate-700 hover:bg-slate-600 text-white border-slate-600"
                  : "bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed"
              }`}
            >
              Copy Text
            </button>
          </div>
        </div>

        {liveTranscriptionStore.isError && errorText ? (
          <div className="p-4 bg-red-900/30 rounded-lg text-red-200 border border-red-500">
            {errorText}
          </div>
        ) : (
          <div className="p-4 bg-slate-700 rounded-lg text-slate-100 min-h-[200px] max-h-[400px] overflow-y-auto">
            {text ? (
              <p className="whitespace-pre-wrap">{text}</p>
            ) : (
              <p className="text-slate-400 italic">{getPlaceholderText()}</p>
            )}
          </div>
        )}

        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-slate-500">
            {liveTranscriptionStore.isActive && <span>Recording...</span>}
            {liveTranscriptionStore.isPreparing && <span>Preparing...</span>}
          </div>

          {showContinueButton && (
            <button
              onClick={handleContinue}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors shadow-md"
            >
              Continue to Refine
            </button>
          )}
        </div>
      </div>
    );
  },
);

export default LiveTranscription;
