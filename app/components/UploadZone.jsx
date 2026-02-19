"use client";
import { useState } from "react";
import { Upload, Image as ImageIcon } from "lucide-react";

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
      className={`border-2 border-dashed rounded-3xl p-10 text-center cursor-pointer transition-all duration-300
        ${hover
          ? "border-indigo-500 bg-indigo-50/50 scale-[0.99] shadow-inner"
          : "border-slate-200 bg-slate-50/30 hover:bg-slate-50 hover:border-slate-300"}`}
      onDragOver={(e) => { e.preventDefault(); setHover(true); }}
      onDragLeave={() => setHover(false)}
      onDrop={(e) => { e.preventDefault(); setHover(false); handle(e.dataTransfer.files); }}
      onClick={() => document.getElementById("xrayInput").click()}
    >
      <input id="xrayInput" hidden type="file" multiple accept="image/*"
        onChange={(e) => handle(e.target.files)} />

      <div className="flex flex-col items-center gap-4">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${hover ? 'bg-indigo-600' : 'bg-slate-200'}`}>
          <Upload className={`w-7 h-7 ${hover ? 'text-white' : 'text-slate-500'}`} />
        </div>
        <div>
          <div className="text-lg font-bold text-slate-900">Drop or Click to Upload</div>
          <p className="text-sm text-slate-500 mt-1">High-resolution X-ray (PNG, JPG, DICOM)</p>
        </div>
      </div>
    </div>
  );
}
