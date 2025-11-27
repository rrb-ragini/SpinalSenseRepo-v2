"use client";

import { useState } from "react";
import UploadZone from "./UploadZone";

export default function UploadPanel({ onFiles, files = [], onAnalysis }) {
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    if (!files.length) {
      alert("Please upload an X-ray first.");
      return;
    }

    setLoading(true);

    try {
      const fd = new FormData();
      fd.append("file", files[0]); // MUST MATCH backend

      const res = await fetch("/api/infer", {
        method: "POST",
        body: fd,
      });

      // -----------------------------
      // SAFE JSON HANDLING
      // -----------------------------
      let payload = null;
      let text = "";

      try {
        text = await res.text();            // read raw text (ALWAYS succeeds)
        payload = JSON.parse(text);         // try JSON
      } catch (e) {
        // If JSON fails, payload stays null and text contains the raw response
        payload = null;
      }

      // -----------------------------
      // HANDLE BAD RESPONSE
      // -----------------------------
      if (!res.ok) {
        const msg =
          (payload && payload.error) ||
          text ||
          "Unknown error from server";

        alert("Error analyzing image: " + msg);

        // send raw response to onAnalysis so UI shows useful debug info
        onAnalysis({
          raw_text: text,
          parsed: payload,
        });

        setLoading(false);
        return;
      }

      // -----------------------------
      // SUCCESS CASE
      // -----------------------------
      if (!payload) {
        alert("Server returned non-JSON response: " + text);
        onAnalysis({
          raw_text: text,
          parsed: null,
        });
        setLoading(false);
        return;
      }

      onAnalysis({
        raw_text: JSON.stringify(payload, null, 2),
        parsed: payload,
      });

    } catch (err) {
      alert("Upload failed: " + String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <UploadZone onFiles={onFiles} />

      <button
        onClick={analyze}
        disabled={loading}
        className="mt-4 bg-primary text-white px-5 py-2 rounded"
      >
        {loading ? "Analyzing..." : "Analyze X-rays"}
      </button>

      <div className="mt-4 space-y-3">
        {files.map((file, i) => (
          <div key={i} className="flex gap-3 p-3 border rounded bg-white">
            <img
              src={URL.createObjectURL(file)}
              className="h-20 object-contain rounded"
            />
            <div>{file.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
