/** @format */

import React from "react";

/**
 * 自定义标题栏组件，用于在无边框窗口中显示应用名称
 */
const CustomTitleBar: React.FC = () => {
  return (
    <div className="app-drag-region flex items-center px-4 h-9">
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

export default CustomTitleBar;
