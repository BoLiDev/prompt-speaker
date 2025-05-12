/** @format */

import { BrowserWindow, globalShortcut, screen } from "electron";

/**
 * Global Shortcut Manager
 * responsible for registering and managing application global shortcuts
 */
export class GlobalShortcutManager {
  private mainWindow: BrowserWindow | null = null;
  private registeredShortcuts: Set<string> = new Set();

  /**
   * set the main window reference
   * @param window the main application window
   */
  public setMainWindow(window: BrowserWindow): void {
    this.mainWindow = window;

    // set the ESC key to close the window
    window.webContents.on("before-input-event", (_, input) => {
      if (input.key === "Escape") {
        this.hideWindow();
      }
    });
  }

  /**
   * register all global shortcuts
   */
  public registerAll(): void {
    this.registerTranscriptionShortcut();
    this.registerToggleWindowShortcut();
    this.registerContextActionShortcut();
  }

  /**
   * unregister all global shortcuts
   */
  public unregisterAll(): void {
    this.registeredShortcuts.forEach((shortcut) => {
      globalShortcut.unregister(shortcut);
    });
    this.registeredShortcuts.clear();
  }

  /**
   * register the transcription shortcut
   * when the shortcut is pressed, show the application window and trigger transcription
   */
  private registerTranscriptionShortcut(): void {
    // use Cmd+Shift+Enter (macOS) or Ctrl+Shift+Enter (Windows/Linux)
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
        error,
      );
    }
  }

  /**
   * register the shortcut to toggle the window display status
   */
  private registerToggleWindowShortcut(): void {
    // use Cmd+Alt+Space (macOS) or Ctrl+Alt+Space (Windows/Linux)
    // note: this shortcut may conflict with system shortcuts, users may need to change the system settings
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
        error,
      );
    }
  }

  /**
   * register context action shortcut
   * performs different actions based on current application state
   */
  private registerContextActionShortcut(): void {
    // use Cmd+Enter (macOS) or Ctrl+Enter (Windows/Linux)
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
        error,
      );
    }
  }

  /**
   * handle context action shortcut
   * sends a command to the renderer process to execute context-aware action
   */
  private handleContextAction(): void {
    if (!this.mainWindow) {
      console.warn(
        "Main window not initialized, cannot execute context action",
      );
      return;
    }

    // Show window if not visible
    if (!this.mainWindow.isVisible()) {
      this.showWindow();
    }

    // Send context action command to renderer process
    this.mainWindow.webContents.send("execute-context-action");
    console.log("Context action command sent");
  }

  /**
   * toggle the window display status
   */
  private toggleWindow(): void {
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
  public hideWindow(): void {
    if (!this.mainWindow) return;

    this.mainWindow.setAlwaysOnTop(false);
    this.mainWindow.hide();
  }

  /**
   * show the window
   * public method, allow external call to show the window
   */
  public showWindow(): void {
    if (!this.mainWindow) return;

    // get the current screen where the mouse is located
    const cursorPoint = screen.getCursorScreenPoint();
    const currentDisplay = screen.getDisplayNearestPoint(cursorPoint);

    // calculate the position where the window should be placed (central position)
    const x = Math.round(
      currentDisplay.workArea.x +
        (currentDisplay.workArea.width - this.mainWindow.getSize()[0]) / 2,
    );
    const y = Math.round(
      currentDisplay.workArea.y +
        (currentDisplay.workArea.height - this.mainWindow.getSize()[1]) / 3,
    );

    // ensure the window is displayed on the correct screen and set the position
    this.mainWindow.setPosition(x, y);

    // if the window is minimized, restore the window
    if (this.mainWindow.isMinimized()) {
      this.mainWindow.restore();
    }

    // show the window
    this.mainWindow.show();

    // set the window to be always on top
    this.mainWindow.setAlwaysOnTop(true, "floating");

    // focus the window
    this.mainWindow.focus();
  }

  /**
   * show the application window and send the start transcription message
   */
  private showWindowAndStartTranscription(): void {
    if (!this.mainWindow) {
      console.warn(
        "main window is not initialized, cannot start transcription",
      );
      return;
    }

    // show the window first
    this.showWindow();

    // notify the renderer process to start transcription
    this.mainWindow.webContents.send("start-transcription");
    console.log("start transcription message sent");
  }
}

// create an instance of the global shortcut manager
export const globalShortcutManager = new GlobalShortcutManager();
