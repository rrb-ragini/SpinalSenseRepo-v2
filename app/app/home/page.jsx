"use client";

import { useState } from "react";
import UploadPanel from "../../components/UploadPanel";
import ChatPanel from "../../components/ChatPanel";
import HistoryDashboard from "../../components/HistoryDashboard";
import { Sparkles } from "lucide-react";

export default function Home() {
  const [files, setFiles] = useState([]);
  const [analysis, setAnalysis] = useState(null);

  // ⭐ REQUIRED FOR CHAT MEMORY
  const [history, setHistory] = useState([]);

  const handleDeleteFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setAnalysis(null); // Reset analysis when file is deleted
  };

  return (
    <main className="max-w-[1600px] mx-auto px-6 py-8 animate-fade-in">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
          Analysis Workspace
          <span className="px-2 py-1 rounded-lg bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            AI Enabled
          </span>
        </h1>
        <p className="text-slate-500 mt-1">Upload X-rays to generate clinical spinal insights.</p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-[400px_1fr_380px] gap-8 items-start">
        {/* Left: Upload & Analysis Controls */}
        <section className="glass-card p-6 rounded-[2rem] flex flex-col h-full border-none shadow-xl shadow-slate-200/50">
          <h2 className="text-xl font-bold mb-6 text-slate-800">1. Digital X-Ray</h2>
          <UploadPanel
            onFiles={(arr) => setFiles((prev) => [...prev, ...arr])}
            files={files}
            onAnalysis={(a) => setAnalysis(a)}
            onDeleteFile={handleDeleteFile}
          />
        </section>

        {/* Middle: Analysis Results & Assistant */}
        <section className="flex flex-col gap-6">
          <div className="glass-card p-0 rounded-[2rem] overflow-hidden border-none shadow-xl shadow-slate-200/50 h-[750px] flex flex-col">
            <ChatPanel
              analysis={analysis}
              history={history}
              setHistory={setHistory}
            />
          </div>
        </section>

        {/* Right: History & Progress */}
        <aside className="h-full">
          <HistoryDashboard />
        </aside>
      </div>
    </main>
  );
}
