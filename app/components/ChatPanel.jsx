// When X-ray analysis result arrives, insert it AND save it to memory
useEffect(() => {
  if (!analysis) return;

  const text = `📘 X-ray Analysis Result\n
Cobb Angle: ${analysis.cobb_angle ?? "N/A"}°
Severity: ${analysis.severity ?? "N/A"}
Explanation: ${analysis.explanation ?? "N/A"}`;

  // Show in UI
  setMessages(prev => [...prev, { role: "assistant", content: text }]);

  // ALSO save into server memory
  fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      conversationId: "spinal-user-123",
      saveHistory: true,
      messages: [{ role: "assistant", content: text }]
    })
  });
}, [analysis]);
