/** @format */

import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { useConfigStore } from "@src/stores";

/**
 * ConfigPanel component - Configuration interface for application settings
 */
export const ConfigPanel: React.FC = observer(() => {
  const configStore = useConfigStore();
  const [apiKey, setApiKey] = useState(configStore.getApiKey());
  const [geminiApiKey, setGeminiApiKey] = useState(
    configStore.getGeminiApiKey(),
  );

  const handleSave = () => {
    configStore.setApiKey(apiKey);
    configStore.setGeminiApiKey(geminiApiKey);
    configStore.closeConfig();
  };

  if (!configStore.isConfigOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-transparent z-50 flex items-center justify-center non-selectable">
      <div className="rounded-lg bg-slate-200 p-6 w-11/12 max-w-md border border-slate-300 shadow-xl">
        <h2 className="text-xl font-semibold text-   mb-4">Configuration</h2>

        <div className="mb-4">
          <label
            htmlFor="apiKey"
            className="block text-sm font-medium text-slate-800 mb-1"
          >
            OpenAI API Key
          </label>
          <input
            id="apiKey"
            type="password"
            className="w-full bg-slate-500 rounded-md px-3 py-2 text-white
                     focus:outline-none focus:ring-2 focus:ring-purple-300 focus:bg-slate-700"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-..."
          />
          <p className="mt-1 text-xs text-slate-800">
            Your API key is stored locally and never sent to our servers.
          </p>
        </div>

        <div className="mb-4">
          <label
            htmlFor="geminiApiKey"
            className="block text-sm font-medium text-slate-800 mb-1"
          >
            Gemini API Key
          </label>
          <input
            id="geminiApiKey"
            type="password"
            className="w-full bg-slate-500 rounded-md px-3 py-2 text-white
                     focus:outline-none focus:ring-2 focus:ring-purple-300 focus:bg-slate-700"
            value={geminiApiKey}
            onChange={(e) => setGeminiApiKey(e.target.value)}
            placeholder="AI..."
          />
          <p className="mt-1 text-xs text-slate-800">
            Used for transcript refinement. Stored locally only.
          </p>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            className="px-4 py-2 text-sm font-medium text-slate-800 hover:text-white
                     bg-transparent border border-slate-600 rounded-md hover:bg-slate-700
                     transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500"
            onClick={() => configStore.closeConfig()}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 text-sm font-medium text-white bg-purple-600
                     rounded-md hover:bg-purple-700 transition-colors
                     focus:outline-none focus:ring-2 focus:ring-purple-500"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
});
