/** @format */

import React from "react";
import { observer } from "mobx-react-lite";
import { useUIStore } from "@src/stores";

type TransitionContainerProps = {
  children: [React.ReactNode, React.ReactNode]; // The first is RecordingView, the second is RefinementView
};

/**
 * TransitionContainer component - Manage the switch between the recording view and the refinement view
 */
const TransitionContainer: React.FC<TransitionContainerProps> = observer(
  ({ children }) => {
    const uiStore = useUIStore();

    if (!Array.isArray(children) || children.length !== 2) {
      throw new Error(
        "TransitionContainer must have two child components: RecordingView and RefinementView",
      );
    }

    return (
      <div className="relative overflow-hidden w-full h-full">
        <div
          className="flex transition-transform duration-500 ease-in-out h-full"
          style={{
            transform:
              uiStore.activeView === "refining"
                ? "translateX(-50%)"
                : "translateX(0)",
            width: "200%",
          }}
        >
          {/* Recording view */}
          <div className="w-1/2 h-full">
            {React.cloneElement(children[0] as React.ReactElement, {
              onComplete: () => uiStore.moveToRefinement(),
            })}
          </div>

          {/* Refinement view */}
          <div className="w-1/2 h-full">
            {React.cloneElement(children[1] as React.ReactElement, {
              onBack: () => uiStore.moveToRecording(),
            })}
          </div>
        </div>
      </div>
    );
  },
);

export default TransitionContainer;
