"use client";

import { useState } from "react";
import UploadPanel from "../../components/UploadPanel";
import ChatPanel from "../../components/ChatPanel";

export default function Home() {
  const [files, setFiles] = useState([]);
  const [analysis, setAnalysis] = useState(null);

  // ⭐ REQUIRED FOR CHAT MEMORY
  const [history, setHistory] = useState([]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[420px_1fr] gap-6">
      <div className="card p-6">
        <h2 className="text-2xl font-semibold mb-4">Upload X-rays</h2>
        <UploadPanel
          onFiles={(arr) => setFiles((prev) => [...prev, ...arr])}
          files={files}
          onAnalysis={(a) => setAnalysis(a)}
        />
      </div>

      <div>
        <div className="card p-6 bg-gradient-to-b from-accent to-purple-600 text-white mb-4">
          <h3 className="text-xl font-bold">Spine Assistant</h3>
        </div>

        {/* ⭐ ChatPanel must receive BOTH props */}
        <ChatPanel
          analysis={analysis}
          history={history}
          setHistory={setHistory}
        />
      </div>
    </div>
  );
}
