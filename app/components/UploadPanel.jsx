const analyze = async () => {
  if (!files.length) {
    alert("Please upload an X-ray first.");
    return;
  }

  setLoading(true);

  try {
    const fd = new FormData();
    fd.append("file", files[0]); // KEY MUST MATCH infer backend

    const res = await fetch("/api/infer", {
      method: "POST",
      body: fd,
    });

    const json = await res.json();

    if (!res.ok) {
      alert("Error analyzing image: " + (json.error || "Unknown error"));
      return;
    }

    onAnalysis({
      parsed: json,  // return backend JSON directly
      raw_text: JSON.stringify(json, null, 2)
    });

  } catch (err) {
    alert("Upload failed: " + String(err));
  } finally {
    setLoading(false);
  }
};
