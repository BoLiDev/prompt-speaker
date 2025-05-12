/** @format */

/// <reference types="vite/client" />

// 添加对SVG文件的类型支持
declare module "*.svg" {
  const content: string;
  export default content;
}

// 添加Electron API的类型定义
interface Window {
  electron: {
    getAssetPath: (assetPath: string) => string;
    // ... 其他API
  };
  ipcRenderer: {
    on: (channel: string, listener: (...args: unknown[]) => void) => void;
    // ... 其他IPC方法
  };
}
