/** @format */

import RecordingView from "./RecordingView";
import RefinementView from "./RefinementView";
import TransitionContainer from "./TransitionContainer";
import ConfigPanel from "./ConfigPanel";

export const V1UI: React.FC = () => {
  return (
    <div className="h-full">
      <TransitionContainer>
        <RecordingView />
        <RefinementView />
      </TransitionContainer>
      <ConfigPanel />
    </div>
  );
};
