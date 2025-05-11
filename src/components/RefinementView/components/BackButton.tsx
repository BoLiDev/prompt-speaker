/** @format */

import React from "react";
import { useRefineStore } from "@src/stores";

interface BackButtonProps {
  onBack?: () => void;
}

const BackButton: React.FC<BackButtonProps> = ({ onBack }) => {
  const refinementStore = useRefineStore();

  const handleBack = () => {
    refinementStore.reset();
    onBack?.();
  };

  return (
    <div className="mb-6">
      <button
        onClick={handleBack}
        className="flex items-center px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-md transition-colors shadow-md"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-1"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 010 2H5.414l4.293 4.293a1 1 0 010 1.414z"
            clipRule="evenodd"
          />
        </svg>
        Return to Recording
      </button>
    </div>
  );
};

export default BackButton;
