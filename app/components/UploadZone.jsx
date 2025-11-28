"use client";
import { useState } from "react";

export default function UploadZone({ onFiles }) {
  const [hover, setHover] = useState(false);

  const handle = (files) => {
    const arr = Array.from(files);
    onFiles(arr);
    // Reset the file input so the same file can be selected again
    const input = document.getElementById("xrayInput");
    if (input) input.value = "";
  };

  return (
    <div
      className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer 
        ${hover ? "border-primary bg-blue-50" : "border-slate-300"}`}
      onDragOver={(e) => { e.preventDefault(); setHover(true); }}
      onDragLeave={() => setHover(false)}
      onDrop={(e) => { e.preventDefault(); setHover(false); handle(e.dataTransfer.files); }}
      onClick={() => document.getElementById("xrayInput").click()}
    >
      <input id="xrayInput" hidden type="file" multiple accept="image/*"
        onChange={(e) => handle(e.target.files)} />
      <div className="text-lg font-medium">Drop or Click to Upload X-ray</div>
      <div className="text-sm text-slate-500">PNG, JPG, DICOM-exported images</div>
    </div>
  );
}
