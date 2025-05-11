/** @format */

import React from "react";
import { observer } from "mobx-react-lite";
import { useRefineStore } from "@src/stores";
import ReactMarkdown from "react-markdown";
import { copyToClipboard } from "@src/utils";
const RefinedResult: React.FC = observer(() => {
  const refineStore = useRefineStore();
  const { isRefining, refinedText, refinementError } = refineStore;

  // 自定义Markdown样式，使其与应用主题协调
  const markdownStyles = {
    // 标题样式
    h1: "text-2xl font-bold text-white mb-4 mt-2",
    h2: "text-xl font-bold text-white mb-3 mt-2",
    h3: "text-lg font-bold text-white mb-2 mt-2",
    h4: "text-base font-bold text-white mb-2 mt-2",
    // 段落样式
    p: "mb-4 text-slate-100",
    // 列表样式
    ul: "list-disc pl-5 mb-4 text-slate-100",
    ol: "list-decimal pl-5 mb-4 text-slate-100",
    li: "mb-1",
    // 引用样式
    blockquote: "border-l-4 border-indigo-500 pl-4 italic text-slate-300 my-4",
    // 代码样式
    code: "bg-slate-900 px-1 rounded text-indigo-300 font-mono",
    pre: "bg-slate-900 p-4 rounded-md overflow-x-auto text-slate-300 my-4",
    // 强调样式
    strong: "font-bold text-indigo-300",
    em: "italic text-slate-300",
    // 链接样式
    a: "text-indigo-400 hover:underline",
    // 分割线样式
    hr: "border-t border-slate-600 my-6",
  };

  return (
    <div className="flex-1">
      <h3 className="text-lg font-medium text-slate-300 mb-2 flex justify-between">
        <span>AI refined result</span>
        {!isRefining && refinedText && (
          <button
            onClick={() => copyToClipboard(refinedText)}
            className="text-sm text-slate-400 hover:text-slate-200"
          >
            Copy
          </button>
        )}
      </h3>

      {isRefining ? (
        <div className="flex flex-col items-center justify-center p-8 bg-slate-700 rounded-lg h-48">
          <div className="animate-pulse flex space-x-4 mb-4">
            <div className="h-3 w-3 bg-indigo-500 rounded-full"></div>
            <div className="h-3 w-3 bg-indigo-500 rounded-full"></div>
            <div className="h-3 w-3 bg-indigo-500 rounded-full"></div>
          </div>
          <p className="text-slate-400">AI is refining text...</p>
        </div>
      ) : refinementError ? (
        <div className="p-4 bg-red-900/30 rounded-lg text-red-200 border border-red-500">
          <p className="font-medium mb-2">Error refining text:</p>
          <p>{refinementError}</p>
        </div>
      ) : refinedText ? (
        <div className="p-4 bg-slate-700 rounded-lg border-2 border-indigo-500 overflow-auto max-h-[50vh]">
          <ReactMarkdown
            components={{
              h1: (props) => <h1 className={markdownStyles.h1} {...props} />,
              h2: (props) => <h2 className={markdownStyles.h2} {...props} />,
              h3: (props) => <h3 className={markdownStyles.h3} {...props} />,
              h4: (props) => <h4 className={markdownStyles.h4} {...props} />,
              p: (props) => <p className={markdownStyles.p} {...props} />,
              ul: (props) => <ul className={markdownStyles.ul} {...props} />,
              ol: (props) => <ol className={markdownStyles.ol} {...props} />,
              li: (props) => <li className={markdownStyles.li} {...props} />,
              blockquote: (props) => (
                <blockquote className={markdownStyles.blockquote} {...props} />
              ),
              code: (props) => (
                <code className={markdownStyles.code} {...props} />
              ),
              pre: (props) => <pre className={markdownStyles.pre} {...props} />,
              strong: (props) => (
                <strong className={markdownStyles.strong} {...props} />
              ),
              em: (props) => <em className={markdownStyles.em} {...props} />,
              a: (props) => (
                <a
                  className={markdownStyles.a}
                  {...props}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              ),
              hr: (props) => <hr className={markdownStyles.hr} {...props} />,
            }}
          >
            {refinedText}
          </ReactMarkdown>
        </div>
      ) : (
        <div className="p-4 bg-slate-700 rounded-lg text-slate-400 italic">
          Refined text will appear here. Click the "Refine text" button to
          start.
        </div>
      )}
    </div>
  );
});

export default RefinedResult;
