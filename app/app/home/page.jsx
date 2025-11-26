
"use client";
import { useState } from "react";
import UploadPanel from "../../components/UploadPanel";
import ChatPanel from "../../components/ChatPanel";

export default function Home() {
  const [files, setFiles] = useState([]);
  const [analysis, setAnalysis] = useState(null);

  const onFiles = (newFiles) => {
    // Accept array of files; dedupe
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const onAnalysis = (result) => {
    setAnalysis(result);
  };

  return (
    <div className="grid-2">
      <div>
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Upload X-Ray</h3>
              <p className="text-sm text-slate-500">PNG, JPG or DICOM exported as image</p>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 rounded bg-primary-500 text-white">Upload</button>
              <button className="px-3 py-1 rounded bg-slate-100">History</button>
            </div>
          </div>

          <UploadPanel onFiles={onFiles} files={files} onAnalysis={onAnalysis} />
        </div>
      </div>

      <div>
        <div className="card p-6" style={{ background: "linear-gradient(180deg,#6b46c1, #7c4ed9)", color: "white" }}>
          <h3 className="text-2xl font-bold">Your AI Coach</h3>
          <p className="mt-2 text-sm opacity-90">Discuss the analysis, get exercises and lifestyle recommendations.</p>
        </div>

        <ChatPanel analysis={analysis} />
      </div>
    </div>
  );
}
