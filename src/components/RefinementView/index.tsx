/** @format */

import React from "react";
import { observer } from "mobx-react-lite";
import {
  ActionButtons,
  BackButton,
  OriginalTranscription,
  RefinedResult,
} from "./components";

type RefinementViewProps = {
  onBack?: () => void;
};

/**
 * RefinementView component - The text refinement interface
 */
const RefinementView: React.FC<RefinementViewProps> = observer(({ onBack }) => {
  return (
    <div className="flex flex-col h-full p-6">
      <BackButton onBack={onBack} />
      <OriginalTranscription />
      <RefinedResult />
      <ActionButtons onBack={onBack} />
    </div>
  );
});

export default RefinementView;
