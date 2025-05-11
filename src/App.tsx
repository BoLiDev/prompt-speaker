/** @format */

import TransitionContainer from "@src/components/TransitionContainer";
import RecordingView from "@src/components/RecordingView";
import RefinementView from "@src/components/RefinementView";
import ConfigPanel from "@src/components/ConfigPanel";
import ConfigButton from "@src/components/ConfigPanel/ConfigButton";
import { rootStore, StoreContext } from "@src/stores";

function App() {
  return (
    <StoreContext.Provider value={rootStore}>
      <div className="min-h-screen bg-slate-900 flex flex-col">
        <header className="py-4 px-6 bg-slate-800 border-b border-slate-700 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-400">
            Voice Assistant
          </h1>
          <ConfigButton />
        </header>

        <main className="flex-1 overflow-hidden">
          <div className="app-container h-full">
            <TransitionContainer>
              <RecordingView />
              <RefinementView />
            </TransitionContainer>
          </div>
        </main>

        <footer className="py-3 px-6 bg-slate-800 border-t border-slate-700 text-center text-slate-500 text-sm">
          Voice Assistant - Support batch and real-time speech-to-text
        </footer>
      </div>

      <ConfigPanel />
    </StoreContext.Provider>
  );
}

export default App;
