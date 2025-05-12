/** @format */

import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useConfigStore } from "@src/stores";

/**
 * SliderInput - 自定义带有紫色主题的滑块组件
 */
const SliderInput: React.FC<{
  id: string;
  min: string | number;
  max: string | number;
  step: string | number;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ id, min, max, step, value, onChange }) => {
  const percentage =
    ((value - Number(min)) / (Number(max) - Number(min))) * 100;

  return (
    <input
      id={id}
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={onChange}
      className="w-full appearance-none h-2 rounded-lg outline-none cursor-pointer
                focus:outline-none
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                [&::-webkit-slider-thumb]:bg-purple-500 [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md
                [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4
                [&::-moz-range-thumb]:bg-purple-500 [&::-moz-range-thumb]:rounded-full
                [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-none"
      style={{
        background: `linear-gradient(to right, #a855f7 0%, #a855f7 ${percentage}%, #cbd5e1 ${percentage}%, #cbd5e1 100%)`,
      }}
    />
  );
};

/**
 * SystemPromptSection - 系统提示配置组件
 */
const SystemPromptSection: React.FC = observer(() => {
  const configStore = useConfigStore();

  return (
    <div className="space-y-4">
      <h3 className="text-md font-medium text-slate-700">System Prompt</h3>
      <div className="space-y-2">
        <textarea
          id="systemPrompt"
          className="w-full text-xs bg-slate-400 rounded-md px-2 py-1 text-white
                   focus:outline-none focus:ring-2 focus:ring-purple-300 focus:bg-slate-500
                   no-scrollbar"
          placeholder="You are a helpful assistant that ..."
          rows={10}
          value={configStore.systemPrompt}
          onChange={(e) => (configStore.systemPrompt = e.target.value)}
        />
        <button
          className="mt-2 px-4 py-1 text-xs font-medium text-slate-800 hover:text-white
                 bg-transparent border border-slate-500 rounded-md hover:bg-slate-500
                 transition-colors focus:outline-none"
          onClick={() => configStore.resetSystemPrompt()}
        >
          Reset to Defaults
        </button>
      </div>
    </div>
  );
});

/**
 * ApiKeysSection - API 密钥配置组件
 */
const ApiKeysSection: React.FC = observer(() => {
  const configStore = useConfigStore();

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-md font-medium text-slate-700">API Keys</h3>
        <p className="text-xs text-slate-600">
          Your API key is stored locally and never sent to our servers.
        </p>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="apiKey"
          className="block text-sm font-medium text-slate-800"
        >
          OpenAI API Key
        </label>
        <input
          id="apiKey"
          type="password"
          className="w-full bg-slate-400 rounded-md px-3 py-2 text-white
                   focus:outline-none focus:ring-2 focus:ring-purple-300 focus:bg-slate-500"
          value={configStore.openAIKey}
          onChange={(e) => (configStore.openAIKey = e.target.value)}
          placeholder="sk-..."
        />
        <p className="text-xs text-slate-600">
          Used for streaming live transcription.
        </p>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="geminiApiKey"
          className="block text-sm font-medium text-slate-800"
        >
          Gemini API Key
        </label>
        <input
          id="geminiApiKey"
          type="password"
          className="w-full bg-slate-400 rounded-md px-3 py-2 text-white
                   focus:outline-none focus:ring-2 focus:ring-purple-300 focus:bg-slate-500"
          value={configStore.geminiApiKey}
          onChange={(e) => (configStore.geminiApiKey = e.target.value)}
          placeholder="AI..."
        />
        <p className="text-xs text-slate-600">
          Used for transcript refinement.
        </p>
      </div>
    </div>
  );
});

/**
 * TranscriptionModelSection - 转录模型配置组件
 */
const TranscriptionModelSection: React.FC = observer(() => {
  const configStore = useConfigStore();

  return (
    <div className="space-y-4">
      <h3 className="text-md font-medium text-slate-700">
        Transcription Model
      </h3>
      <div className="space-y-2">
        <label
          htmlFor="model"
          className="block text-sm font-medium text-slate-800"
        >
          Model
        </label>
        <select
          id="model"
          className="w-full bg-slate-400 rounded-md px-3 py-2 text-white
                  focus:outline-none focus:ring-2 focus:ring-purple-300 focus:bg-slate-500"
          value={configStore.model}
          onChange={(e) => (configStore.model = e.target.value)}
        >
          <option value="gpt-4o-transcribe">gpt-4o-transcribe</option>
          <option value="gpt-4o-mini-transcribe">gpt-4o-mini-transcribe</option>
          <option value="whisper-1">whisper-1</option>
        </select>
      </div>
    </div>
  );
});

/**
 * TranscriptionSettingsSection - 转录设置配置组件
 */
const TranscriptionSettingsSection: React.FC = observer(() => {
  const configStore = useConfigStore();

  return (
    <div className="space-y-4">
      <h3 className="text-md font-medium text-slate-700">
        Transcription Settings
      </h3>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label
            htmlFor="silenceDuration"
            className="block text-sm font-medium text-slate-800"
          >
            Silence Duration (ms)
          </label>
          <span className="text-xs text-slate-600">
            {configStore.silenceDuration}ms
          </span>
        </div>
        <SliderInput
          id="silenceDuration"
          min="100"
          max="1000"
          step="50"
          value={configStore.silenceDuration}
          onChange={(e) =>
            (configStore.silenceDuration = Number(e.target.value))
          }
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label
            htmlFor="prefixPadding"
            className="block text-sm font-medium text-slate-800"
          >
            Prefix Padding (ms)
          </label>
          <span className="text-xs text-slate-600">
            {configStore.prefixPadding}ms
          </span>
        </div>
        <SliderInput
          id="prefixPadding"
          min="100"
          max="1000"
          step="50"
          value={configStore.prefixPadding}
          onChange={(e) => (configStore.prefixPadding = Number(e.target.value))}
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label
            htmlFor="vadThreshold"
            className="block text-sm font-medium text-slate-800"
          >
            VAD Threshold
          </label>
          <span className="text-xs text-slate-600">
            {configStore.vadThreshold.toFixed(2)}
          </span>
        </div>
        <SliderInput
          id="vadThreshold"
          min="0.1"
          max="0.9"
          step="0.05"
          value={configStore.vadThreshold}
          onChange={(e) => (configStore.vadThreshold = Number(e.target.value))}
        />
      </div>

      <button
        className="mt-2 px-4 py-1 text-xs font-medium text-slate-800 hover:text-white
                 bg-transparent border border-slate-500 rounded-md hover:bg-slate-500
                 transition-colors focus:outline-none"
        onClick={() => configStore.resetTranscriptionParams()}
      >
        Reset to Defaults
      </button>
    </div>
  );
});

/**
 * ConfigPanel component - Configuration interface for application settings
 * Displays as a sliding panel from the left side of the screen
 */
export const ConfigPanel: React.FC = observer(() => {
  const configStore = useConfigStore();
  const [isVisible, setIsVisible] = useState(false);
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    if (configStore.isConfigOpen) {
      setIsRendered(true);
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
      setTimeout(() => setIsRendered(false), 300);
    }
  }, [configStore.isConfigOpen]);

  if (!isRendered) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 top-8 bg-black/30 z-50 flex non-selectable transition-opacity duration-300"
      style={{ opacity: isVisible ? 1 : 0 }}
    >
      {/* Backdrop overlay - clicking it closes the panel */}
      <div
        className="absolute inset-0 top-8"
        onClick={() => configStore.closeConfig()}
      />

      {/* Side panel */}
      <div
        className={`relative bg-slate-200 w-80 max-w-[80vw] h-full shadow-xl transition-transform duration-300 ease-in-out ${isVisible ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex flex-col h-full overflow-y-scroll no-scrollbar">
          <div className="p-6 flex-grow">
            <h2 className="text-xl font-semibold text-slate-800 mb-6">
              Settings
            </h2>

            <div className="space-y-6 flex-grow">
              <SystemPromptSection />
              <ApiKeysSection />
              <TranscriptionModelSection />
              <TranscriptionSettingsSection />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
