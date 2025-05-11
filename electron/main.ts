/** @format */

import { app, BrowserWindow, ipcMain } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import os from "node:os";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.env.APP_ROOT = path.join(__dirname, "..");

export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

// 支持gRPC需要强制使用Node.js DNS解析器
process.env.GRPC_DNS_RESOLVER = "native";

let win: BrowserWindow | null;

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // Test active push message to Renderer-process.
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
    console.log("📝 Renderer process loaded");
  });

  // Open DevTools in development mode
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
    win.webContents.openDevTools();
    console.log("🔧 DevTools opened automatically in dev mode");
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}

/**
 * 创建临时文件
 *
 * @param options 临时文件选项
 * @param options.prefix 文件名前缀
 * @param options.extension 文件扩展名（不含点）
 * @returns 临时文件路径
 */
ipcMain.handle(
  "create-temp-file",
  (_, options: { prefix?: string; extension?: string }) => {
    const tempDir = os.tmpdir();
    const prefix = options.prefix || "temp_";
    const extension = options.extension ? `.${options.extension}` : "";
    const tempFilePath = path.join(
      tempDir,
      `${prefix}${Date.now()}${extension}`,
    );

    // 创建一个空文件
    fs.writeFileSync(tempFilePath, "");

    return tempFilePath;
  },
);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(createWindow);

// Add global error handling for uncaught exceptions in main process
process.on("uncaughtException", (error) => {
  console.error("🚨 Uncaught exception in main process:", error);
});
