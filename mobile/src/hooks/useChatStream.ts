// hooks/useChatStream.ts
import { useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export const useChatStream = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (content: string) => {
    const userMessage: Message = { role: "user", content: content.trim() };
    if (!userMessage.content) return;

    // Optimistically add user message
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // We'll keep a reference to cancel if needed
    let aborted = false;

    try {
      const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) {
        throw new Error("Missing Supabase URL or anon key");
      }

      const response = await fetch(`${supabaseUrl}/functions/v1/matchbot-chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Server error ${response.status}: ${text || response.statusText}`);
      }

      if (!response.body) {
        throw new Error("No response body (streaming not supported)");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";
      let assistantContent = "";

      // Add placeholder for assistant
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (!aborted) {
        const { done, value } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n");
        buffer = lines.pop() || ""; // Last incomplete line stays in buffer

        for (const line of lines) {
          if (!line.trim()) continue;
          if (line.startsWith(":")) continue; // SSE comments
          if (!line.startsWith("data: ")) continue;

          const data = line.slice(6).trim();
          if (!data || data === "[DONE]") continue;

          try {
            const parsed = JSON.parse(data);
            const delta = parsed.choices?.[0]?.delta?.content;

            if (delta) {
              assistantContent += delta;

              // Update only the last message (streaming)
              setMessages((prev) => {
                if (!Array.isArray(prev) || prev.length === 0) return prev;
                const updated = [...prev];
                updated[updated.length - 1] = {
                  role: "assistant",
                  content: assistantContent,
                };
                return updated;
              });
            }
          } catch (parseError) {
            console.warn("Failed to parse SSE line:", line, parseError);
            // Skip malformed lines — don't break entire stream
          }
        }
      }

      // Final cleanup: remove empty assistant if something went wrong
      if (assistantContent.trim() === "" && !aborted) {
        setMessages((prev) => prev.slice(0, -1));
      }
    } catch (error: any) {
      console.error("Chat stream error:", error);

      // Only remove placeholder if it's empty
      setMessages((prev) => {
        if (prev.length === 0) return prev;
        const last = prev[prev.length - 1];
        if (last.role === "assistant" && last.content.trim() === "") {
          return prev.slice(0, -1);
        }
        return prev;
      });

      // Optional: show user feedback
      // Alert.alert("Chat Error", error.message || "Failed to reach assistant");
    } finally {
      if (!aborted) {
        setIsLoading(false);
      }
    }
  };

  // Optional: expose a cancel method if you want to abort mid-stream
  // const cancel = () => { aborted = true; setIsLoading(false); };

  return {
    messages,
    isLoading,
    sendMessage,
    // cancel,
  };
};