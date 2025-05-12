/** @format */

import React from "react";
import cx from "classnames";
/**
 * Custom Title Bar
 */
const TitleBar: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={cx("app-drag-region flex items-center px-4 h-9", className)}
    >
      {/* <div className="flex items-center flex-1 ml-16">
        <img
          src="/electron-vite.svg"
          alt="logo"
          className="w-5 h-5 mr-2 non-draggable"
        />
        <h1 className="text-white text-sm font-medium non-draggable">
          {title}
        </h1>
      </div> */}
    </div>
  );
};

export default TitleBar;
