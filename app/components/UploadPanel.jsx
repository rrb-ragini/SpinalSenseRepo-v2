"use client";

import { useState, useEffect } from "react";
import UploadZone from "./UploadZone";
import { Play, Trash2, Download, Info } from "lucide-react";

export default function UploadPanel({ onFiles, files = [], onAnalysis, onDeleteFile }) {
  const [loading, setLoading] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [previousFileCount, setPreviousFileCount] = useState(0);

  // Reset analyzed state when files change
  useEffect(() => {
    if (files.length !== previousFileCount) {
      setAnalyzed(false);
      setPreviousFileCount(files.length);
    }
  }, [files, previousFileCount, analyzed]);

  const analyze = async () => {
    if (!files.length) {
      alert("Please upload an X-ray first.");
      return;
    }

    if (analyzed) {
      alert("This X-ray has already been analyzed.");
      return;
    }

    setLoading(true);

    try {
      const fd = new FormData();
      fd.append("file", files[0]);

      const res = await fetch("/api/infer", {
        method: "POST",
        body: fd,
      });

      let payload = null;
      let text = "";

      try {
        text = await res.text();
        payload = JSON.parse(text);
      } catch {
        payload = null;
      }

      if (!res.ok) {
        const msg = (payload && payload.error) || text || "Unknown error";
        alert("Error analyzing image: " + msg);
        onAnalysis(payload || { error: msg });
        setLoading(false);
        return;
      }

      onAnalysis(payload);
      setAnalyzed(true);
    } catch (err) {
      alert("Upload failed: " + String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (index) => {
    if (onDeleteFile) {
      onDeleteFile(index);
      setAnalyzed(false);
    }
  };

  return (
    <div className="space-y-6">
      <UploadZone onFiles={(newFiles) => {
        onFiles(newFiles);
        setAnalyzed(false);
      }} />

      <div className="flex flex-col gap-3">
        <button
          onClick={analyze}
          disabled={loading || !files.length || analyzed}
          className={`flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-bold text-lg transition-all shadow-lg
            ${loading || !files.length || analyzed
              ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
              : "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-200 active:scale-[0.98]"
            }`}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Processing...
            </span>
          ) : analyzed ? (
            "Analysis Complete"
          ) : (
            <>
              <Play className="w-5 h-5 fill-current" />
              Analyze X-ray
            </>
          )}
        </button>

        <a
          href="https://www.choa.org/blog/2018/august/~/media/407CB5DBD39947E9AE42FCB9E6FAC76B.ashx?h=421&w=276"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 text-indigo-600 text-sm font-semibold py-2 hover:bg-indigo-50 rounded-xl transition-colors"
        >
          <Download className="w-4 h-4" />
          Download Demo X-ray
        </a>
      </div>

      <div className="space-y-3">
        {files.length > 0 && <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Uploaded Assets</h4>}
        {files.map((file, i) => (
          <div key={i} className="flex gap-4 p-4 glass-card rounded-2xl items-center animate-slide-up bg-white/40">
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
              <img
                src={URL.createObjectURL(file)}
                className="w-full h-full object-cover"
                alt={file.name}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-slate-900 truncate text-sm">{file.name}</p>
              <p className="text-xs text-slate-500 font-medium">{(file.size / 1024).toFixed(1)} KB • Ready</p>
            </div>
            <button
              onClick={() => handleDelete(i)}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
              title="Remove"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 flex gap-3">
        <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-800 leading-relaxed">
          Ensure X-ray is centered and properly illuminated for best AI detection results.
        </p>
      </div>
    </div>
  );
}
