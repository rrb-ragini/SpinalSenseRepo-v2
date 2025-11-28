"use client";

import { useState } from "react";
import UploadPanel from "../../components/UploadPanel";
import ChatPanel from "../../components/ChatPanel";

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
    <div className="grid grid-cols-1 md:grid-cols-[420px_1fr] gap-6">
      <div className="card p-6 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-semibold mb-4">Upload X-rays</h2>
        <UploadPanel
          onFiles={(arr) => setFiles((prev) => [...prev, ...arr])}
          files={files}
          onAnalysis={(a) => setAnalysis(a)}
          onDeleteFile={handleDeleteFile}
        />
      </div>

      <div>
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
