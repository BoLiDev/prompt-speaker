/** @format */

import { ipcRenderer } from "electron";
import { rootStore } from "./stores";
import { clipboard } from "electron";
import { cleanMarkdownFormatting } from "./utils/markdownUtils";
/**
 * IPC消息处理器
 * 负责处理来自主进程的IPC消息
 */
export class IpcHandlers {
  /**
   * 初始化所有IPC消息处理器
   */
  public static init(): void {
    IpcHandlers.setupTranscriptionHandlers();
    IpcHandlers.setupContextActionHandlers();
    console.log("IPC处理器已初始化");
  }

  /**
   * 设置语音转录相关的IPC处理器
   */
  private static setupTranscriptionHandlers(): void {
    // 监听来自主进程的开始转录消息
    ipcRenderer.on("start-transcription", () => {
      console.log("收到开始转录指令");

      // 确保rootStore和liveTranscriptionStore已初始化
      if (rootStore && rootStore.liveTranscriptionStore) {
        // 如果转录功能已经在运行，无需重复启动
        if (
          rootStore.liveTranscriptionStore.isActive ||
          rootStore.liveTranscriptionStore.isPreparing
        ) {
          console.log("转录功能已在运行中");
          return;
        }

        // 启动语音转录
        console.log("正在启动语音转录...");
        rootStore.liveTranscriptionStore.startRecording();
      } else {
        console.error("rootStore或liveTranscriptionStore未初始化");
      }
    });
  }

  /**
   * 设置上下文操作相关的IPC处理器
   * 根据当前应用状态执行不同的操作
   */
  private static setupContextActionHandlers(): void {
    // 监听来自主进程的执行上下文操作消息
    ipcRenderer.on("execute-context-action", () => {
      console.log("Received context action command");

      // 确保rootStore已初始化
      if (!rootStore) {
        console.error("rootStore is not initialized");
        return;
      }

      // 确保liveTranscriptionStore已初始化
      const liveTranscriptionStore = rootStore.liveTranscriptionStore;
      if (!liveTranscriptionStore) {
        console.error("liveTranscriptionStore is not initialized");
        return;
      }

      // 确保refineStore已初始化
      const refineStore = rootStore.refineStore;
      if (!refineStore) {
        console.error("refineStore is not initialized");
        return;
      }

      // 根据当前状态执行相应操作
      if (liveTranscriptionStore.isActive) {
        // 当正在录音时，停止录音
        console.log("Executing: Stop recording");
        liveTranscriptionStore.stopRecording();
      } else if (refineStore.hasOriginalText && !refineStore.isRefining) {
        // 当有转录文本但未精炼时，开始精炼
        console.log("Executing: Start refining");
        refineStore.refineTranscription().then(() => {
          //  当已精炼完成时，复制结果到剪贴板
          console.log("Executing: Copy result");
          clipboard.writeText(cleanMarkdownFormatting(refineStore.refinedText));
        });
      } else {
        console.log("No context action available for current state");
      }
    });
  }
}

// 在应用启动时初始化IPC处理器
export function initializeIpcHandlers(): void {
  IpcHandlers.init();
}
