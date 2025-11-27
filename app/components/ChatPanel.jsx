const sendMessage = async () => {
  if (!input.trim()) return;

  const userMsg = { role: "user", content: input };
  setMessages((prev) => [...prev, userMsg]);
  setInput("");

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        conversationId: "spinal-user-123",   // ✅ Add memory
        saveHistory: true,                   // ✅ Keep messages stored
        messages: [userMsg],                 // ✅ Only send newest message
      }),
    });

    const json = await res.json();

    if (!res.ok) {
      alert("Chat error: " + json.error);
      return;
    }

    const assistantMsg = {
      role: "assistant",
      content: json.message,                // ✅ Use correct field
    };

    setMessages((prev) => [...prev, assistantMsg]);

  } catch (err) {
    alert("Request failed: " + err.message);
  }
};
