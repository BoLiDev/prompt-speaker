/** @format */

import ReactMarkdown from "react-markdown";
import cx from "classnames";

const markdownStyles = {
  h1: "text-2xl font-bold mb-4 mt-2 wenkai",
  h2: "text-xl font-bold mb-3 mt-2 wenkai",
  h3: "text-lg font-bold mb-2 mt-2 wenkai",
  h4: "text-base font-bold mb-2 mt-2 wenkai",
  p: "mb-4 wenkai",
  ul: "list-disc pl-5 mb-4 wenkai",
  ol: "list-decimal pl-5 mb-4 wenkai",
  li: "mb-1 wenkai wenkai",
  pre: "bg-slate-900 p-4 rounded-md overflow-x-auto text-slate-300 my-4 wenkai",
  strong: "font-bold text-purple-500 wenkai",
  em: "italic text-slate-300 wenkai",
  a: "text-purple-600 hover:underline wenkai",
  hr: "border-t border-slate-600 my-6",
  blockquote: "border-l-4 border-purple-700 pl-4 italic text-slate-300 my-4",
  code: "bg-slate-900 px-1 rounded text-purple-500 font-mono",
};

export const MarkdownDisplay: React.FC<{
  markdown: string;
  weak?: boolean;
  className?: string;
}> = ({ markdown, weak, className }) => {
  return (
    <div
      className={cx(className, {
        "text-slate-500": weak,
        "text-slate-800": !weak,
      })}
    >
      <ReactMarkdown
        components={{
          h1: (props) => <h1 className={cx(markdownStyles.h1)} {...props} />,
          h2: (props) => <h2 className={cx(markdownStyles.h2)} {...props} />,
          h3: (props) => <h3 className={cx(markdownStyles.h3)} {...props} />,
          h4: (props) => <h4 className={cx(markdownStyles.h4)} {...props} />,
          p: (props) => <p className={cx(markdownStyles.p)} {...props} />,
          ul: (props) => <ul className={cx(markdownStyles.ul)} {...props} />,
          ol: (props) => <ol className={cx(markdownStyles.ol)} {...props} />,
          li: (props) => <li className={cx(markdownStyles.li)} {...props} />,
          blockquote: (props) => (
            <blockquote className={cx(markdownStyles.blockquote)} {...props} />
          ),
          code: (props) => <code className={markdownStyles.code} {...props} />,
          pre: (props) => <pre className={markdownStyles.pre} {...props} />,
          strong: (props) => (
            <strong className={markdownStyles.strong} {...props} />
          ),
          em: (props) => <em className={markdownStyles.em} {...props} />,
          a: (props) => (
            <a
              className={cx(markdownStyles.a)}
              {...props}
              target="_blank"
              rel="noopener noreferrer"
            />
          ),
          hr: (props) => <hr className={markdownStyles.hr} {...props} />,
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
};
