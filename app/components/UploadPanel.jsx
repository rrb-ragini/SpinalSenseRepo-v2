"use client";

import { useState, useEffect } from "react";
import UploadZone from "./UploadZone";

export default function UploadPanel({ onFiles, files = [], onAnalysis, onDeleteFile }) {
  const [loading, setLoading] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [previousFileCount, setPreviousFileCount] = useState(0);

  // Reset analyzed state when files change
  useEffect(() => {
    console.log("Files changed:", files.length, "Previous:", previousFileCount, "Analyzed:", analyzed);
    // If file count changed (either added or removed), reset analyzed state
    if (files.length !== previousFileCount) {
      console.log("Resetting analyzed state to false");
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
      alert("This X-ray has already been analyzed. Please upload a new X-ray to analyze again.");
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
        const msg =
          (payload && payload.error) ||
          text ||
          "Unknown error from server";

        alert("Error analyzing image: " + msg);

        onAnalysis(payload || { error: msg });
        setLoading(false);
        return;
      }

      if (!payload) {
        alert("Server returned non-JSON response: " + text);
        onAnalysis({ error: "Non-JSON server response", raw: text });
        setLoading(false);
        return;
      }

      onAnalysis(payload);
      setAnalyzed(true); // Mark as analyzed

    } catch (err) {
      alert("Upload failed: " + String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (index) => {
    if (onDeleteFile) {
      onDeleteFile(index);
      setAnalyzed(false); // Reset analyzed state when file is deleted
    }
  };

  return (
    <div>
      <UploadZone onFiles={(newFiles) => {
        onFiles(newFiles);
        setAnalyzed(false); // Reset analyzed state when new files are added
      }} />

      {/* ⭐ Centered Buttons Container */}
      <div className="flex flex-col items-center mt-4">
        <button
          onClick={() => {
            console.log("Analyze button clicked. Files:", files.length, "Analyzed:", analyzed, "Loading:", loading);
            analyze();
          }}
          disabled={loading || !files.length || analyzed}
          title={
            !files.length
              ? "Please upload an X-ray first"
              : analyzed
                ? "This X-ray has already been analyzed"
                : "Click to analyze the uploaded X-ray"
          }
          className={`px-5 py-2 rounded font-medium transition-all ${loading || !files.length || analyzed
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-primary text-white hover:bg-blue-600"
            }`}
        >
          {loading ? "Analyzing..." : analyzed ? "Already Analyzed" : "Analyze X-rays"}
        </button>

        {/* Helper text when no file is uploaded */}
        {!files.length && (
          <p className="text-xs text-gray-500 mt-2 text-center">
            👆 Please upload an X-ray to analyze
          </p>
        )}

        <a
          href="https://www.choa.org/blog/2018/august/~/media/407CB5DBD39947E9AE42FCB9E6FAC76B.ashx?h=421&w=276"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline mt-3 text-sm hover:text-blue-800"
        >
          Download sample X-ray (demo)
        </a>
      </div>

      {/* Existing File Preview Section */}
      <div className="mt-4 space-y-3">
        {files.map((file, i) => (
          <div key={i} className="flex gap-3 p-3 border rounded bg-white items-center">
            <img
              src={URL.createObjectURL(file)}
              className="h-20 object-contain rounded"
              alt={file.name}
            />
            <div className="flex-1">
              <p className="font-medium text-sm">{file.name}</p>
              <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
            <button
              onClick={() => handleDelete(i)}
              className="px-3 py-1 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
              title="Delete this file"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
