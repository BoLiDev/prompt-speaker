/** @format */

import { observer } from "mobx-react-lite";
import cx from "classnames";

import { useLiveTranscriptionStore, useRefineStore } from "@src/stores";
import { MarkdownDisplay } from "./Markdown";
import { MagicBtn } from "./MagicBtn";
import { ClipboardBtn } from "./ClipboardBtn";

const placeholder = "I'd like to ...";

export const MagicPanel: React.FC<{
  className?: string;
}> = observer(({ className }) => {
  const liveTranscriptionStore = useLiveTranscriptionStore();
  const refineStore = useRefineStore();

  const transcript = liveTranscriptionStore.transcript;
  const refinedText = refineStore.refinedText;

  function getContent(placeholder = "") {
    if (liveTranscriptionStore.isActive) {
      return transcript;
    }

    if (refinedText) {
      return refinedText;
    }

    return transcript ? transcript : placeholder;
  }

  function shouldShowCopyButton() {
    return !!refinedText || !!transcript;
  }

  return (
    <div
      className={cx(
        "p-8 flex flex-col bg-slate-200 rounded-3xl relative",
        className,
      )}
    >
      <MarkdownDisplay
        markdown={getContent(placeholder)}
        weak={!transcript && !refinedText}
        className="flex-1 text-xs wenkai overflow-y-scroll no-scrollbar"
      />
      <div className="absolute right-6 bottom-6 space-x-3 flex">
        {shouldShowCopyButton() && <ClipboardBtn text={getContent()} />}
        <MagicBtn />
      </div>
    </div>
  );
});
