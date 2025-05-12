/** @format */

import { observer } from "mobx-react-lite";
import cx from "classnames";

import { useLiveTranscriptionStore, useRefineStore } from "@src/stores";
import { MarkdownDisplay } from "./Markdown";
import { MagicBtn } from "./MagicBtn";

const placeholder = "I'd like to ...";

export const MagicPanel: React.FC<{
  className?: string;
}> = observer(({ className }) => {
  const liveTranscriptionStore = useLiveTranscriptionStore();
  const refineStore = useRefineStore();

  const transcript = liveTranscriptionStore.transcript;
  const refinedText = refineStore.refinedText;

  function getContent() {
    if (refinedText) {
      return refinedText;
    }

    return transcript ? transcript : placeholder;
  }

  return (
    <div
      className={cx(
        "p-8 flex flex-col bg-purple-100 rounded-3xl relative",
        className,
      )}
    >
      <MarkdownDisplay
        markdown={getContent()}
        weak={!transcript && !refinedText}
        className="flex-1 text-xs wenkai overflow-y-scroll no-scrollbar"
      />
      <MagicBtn className="absolute right-6 bottom-6" />
    </div>
  );
});
