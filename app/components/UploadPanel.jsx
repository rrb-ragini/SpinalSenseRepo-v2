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

    } catch (err) {
      alert("Upload failed: " + String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <UploadZone onFiles={onFiles} />

      {/* ⭐ Centered Buttons Container */}
      <div className="flex flex-col items-center mt-4">
        <button
          onClick={analyze}
          disabled={loading}
          className="bg-primary text-white px-5 py-2 rounded"
        >
          {loading ? "Analyzing..." : "Analyze X-rays"}
        </button>

        <a
          href="https://www.choa.org/blog/2018/august/~/media/407CB5DBD39947E9AE42FCB9E6FAC76B.ashx?h=421&w=276"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline mt-3 text-sm"
        >
          Download sample X-ray (demo)
        </a>
      </div>

      {/* Existing File Preview Section */}
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
