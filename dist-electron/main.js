var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { globalShortcut, screen, ipcMain, app, BrowserWindow } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import os from "node:os";
const WINDOW_WIDTH = 800;
const WINDOW_HEIGHT = 500;
const MIN_WINDOW_WIDTH = 800;
const MIN_WINDOW_HEIGHT = 500;
class GlobalShortcutManager {
  constructor() {
    __publicField(this, "mainWindow", null);
    __publicField(this, "registeredShortcuts", /* @__PURE__ */ new Set());
  }
  /**
   * set the main window reference
   * @param window the main application window
   */
  setMainWindow(window) {
    this.mainWindow = window;
    window.webContents.on("before-input-event", (_, input) => {
      if (input.key === "Escape") {
        this.hideWindow();
      }
    });
  }
  /**
   * register all global shortcuts
   */
  registerAll() {
    this.registerTranscriptionShortcut();
    this.registerToggleWindowShortcut();
    this.registerContextActionShortcut();
  }
  /**
   * unregister all global shortcuts
   */
  unregisterAll() {
    this.registeredShortcuts.forEach((shortcut) => {
      globalShortcut.unregister(shortcut);
    });
    this.registeredShortcuts.clear();
  }
  /**
   * register the transcription shortcut
   * when the shortcut is pressed, show the application window and trigger transcription
   */
  registerTranscriptionShortcut() {
    const shortcut = "CommandOrControl+Shift+Enter";
    try {
      globalShortcut.register(shortcut, () => {
        this.showWindowAndStartTranscription();
      });
      this.registeredShortcuts.add(shortcut);
      console.log(`Transcription shortcut registered: ${shortcut}`);
    } catch (error) {
      console.error(
        `Failed to register transcription shortcut ${shortcut}:`,
        error
      );
    }
  }
  /**
   * register the shortcut to toggle the window display status
   */
  registerToggleWindowShortcut() {
    const shortcut = "CommandOrControl+Alt+Space";
    try {
      globalShortcut.register(shortcut, () => {
        this.toggleWindow();
      });
      this.registeredShortcuts.add(shortcut);
      console.log(`Window toggle shortcut registered: ${shortcut}`);
    } catch (error) {
      console.error(
        `Failed to register window toggle shortcut ${shortcut}:`,
        error
      );
    }
  }
  /**
   * register context action shortcut
   * performs different actions based on current application state
   */
  registerContextActionShortcut() {
    const shortcut = "CommandOrControl+Enter";
    try {
      globalShortcut.register(shortcut, () => {
        this.handleContextAction();
      });
      this.registeredShortcuts.add(shortcut);
      console.log(`Context action shortcut registered: ${shortcut}`);
    } catch (error) {
      console.error(
        `Failed to register context action shortcut ${shortcut}:`,
        error
      );
    }
  }
  /**
   * handle context action shortcut
   * sends a command to the renderer process to execute context-aware action
   */
  handleContextAction() {
    if (!this.mainWindow) {
      console.warn(
        "Main window not initialized, cannot execute context action"
      );
      return;
    }
    if (!this.mainWindow.isVisible()) {
      this.showWindow();
    }
    this.mainWindow.webContents.send("execute-context-action");
    console.log("Context action command sent");
  }
  /**
   * toggle the window display status
   */
  toggleWindow() {
    if (!this.mainWindow) return;
    if (this.mainWindow.isVisible() && this.mainWindow.isFocused()) {
      this.hideWindow();
    } else {
      this.showWindow();
    }
  }
  /**
   * hide the window
   */
  hideWindow() {
    if (!this.mainWindow) return;
    this.mainWindow.setAlwaysOnTop(false);
    this.mainWindow.hide();
  }
  /**
   * show the window
   * public method, allow external call to show the window
   */
  showWindow() {
    if (!this.mainWindow) return;
    const cursorPoint = screen.getCursorScreenPoint();
    const currentDisplay = screen.getDisplayNearestPoint(cursorPoint);
    const x = Math.round(
      currentDisplay.workArea.x + (currentDisplay.workArea.width - this.mainWindow.getSize()[0]) / 2
    );
    const y = Math.round(
      currentDisplay.workArea.y + (currentDisplay.workArea.height - this.mainWindow.getSize()[1]) / 3
    );
    this.mainWindow.setPosition(x, y);
    if (this.mainWindow.isMinimized()) {
      this.mainWindow.restore();
    }
    this.mainWindow.show();
    this.mainWindow.setAlwaysOnTop(true, "floating");
    this.mainWindow.focus();
  }
  /**
   * show the application window and send the start transcription message
   */
  showWindowAndStartTranscription() {
    if (!this.mainWindow) {
      console.warn(
        "main window is not initialized, cannot start transcription"
      );
      return;
    }
    this.showWindow();
    this.mainWindow.webContents.send("start-transcription");
    console.log("start transcription message sent");
  }
}
const globalShortcutManager = new GlobalShortcutManager();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
process.env.GRPC_DNS_RESOLVER = "native";
let win;
function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    minWidth: MIN_WINDOW_WIDTH,
    minHeight: MIN_WINDOW_HEIGHT,
    // use system native title bar and controls
    titleBarStyle: "hidden",
    // make the window look like a native window on macOS, while keeping the system buttons and title
    trafficLightPosition: { x: 15, y: 10 },
    // transparent background
    backgroundColor: "#00000000",
    // window rounded corners
    roundedCorners: true,
    // Spotlight style window configuration
    frame: false,
    // no frame
    skipTaskbar: false,
    // show in taskbar
    center: true,
    // center window
    resizable: true,
    // allow resizing
    fullscreenable: false,
    // disable fullscreen
    show: false,
    // create window but don't show it, wait for shortcut to show
    hasShadow: true,
    // window has shadow
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  globalShortcutManager.setMainWindow(win);
  win.on("blur", () => {
    if (win) {
      win.setAlwaysOnTop(false);
      win.hide();
    }
  });
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
    console.log("📝 Renderer process loaded");
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}
ipcMain.handle(
  "create-temp-file",
  (_, options) => {
    const tempDir = os.tmpdir();
    const prefix = options.prefix || "temp_";
    const extension = options.extension ? `.${options.extension}` : "";
    const tempFilePath = path.join(
      tempDir,
      `${prefix}${Date.now()}${extension}`
    );
    fs.writeFileSync(tempFilePath, "");
    return tempFilePath;
  }
);
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  } else if (win && !win.isVisible()) {
    globalShortcutManager.showWindow();
  }
});
app.whenReady().then(() => {
  createWindow();
  globalShortcutManager.registerAll();
});
app.on("will-quit", () => {
  globalShortcutManager.unregisterAll();
});
process.on("uncaughtException", (error) => {
  console.error("🚨 Uncaught exception in main process:", error);
});
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
