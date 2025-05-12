/** @format */

import { contextBridge, ipcRenderer } from "electron";
import path from "path";

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args;
    return ipcRenderer.on(channel, (event, ...args) =>
      listener(event, ...args),
    );
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args;
    return ipcRenderer.off(channel, ...omit);
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args;
    return ipcRenderer.send(channel, ...omit);
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args;
    return ipcRenderer.invoke(channel, ...omit);
  },

  // You can expose other APTs you need here.
  // ...
});

// 获取应用路径
const getAppPath = () => {
  // 在开发模式下，使用public目录
  if (process.env.NODE_ENV === "development") {
    return path.join(process.env.APP_ROOT || "", "public");
  }

  // 在生产模式下，使用应用安装目录
  return path.join(process.resourcesPath, "app.asar.unpacked", "dist");
};

// 暴露给渲染进程的API
contextBridge.exposeInMainWorld("electron", {
  // ... 原有的API ...

  // 获取资源路径
  getAssetPath: (assetPath: string) => {
    return path.join(getAppPath(), assetPath);
  },

  // ... 原有的API ...
});
