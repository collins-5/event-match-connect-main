import { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import { Screen } from "@/components/Screen";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export const ChatScreen = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "1", role: "assistant", content: "Hi! Ask me for event ideas." }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMessage: ChatMessage = {
      id: Math.random().toString(),
      role: "user",
      content: input.trim()
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // TODO: call Supabase edge function matchbot-chat
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          role: "assistant",
          content: "I'll soon hook into the Supabase Edge function to fetch smart replies."
        }
      ]);
      setIsLoading(false);
    }, 600);
  };

  return (
    <Screen scrollable={false}>
      <View style={styles.chatContainer}>
        {messages.map((message) => (
          <View
            key={message.id}
            style={[styles.bubble, message.role === "user" ? styles.userBubble : styles.assistantBubble]}
          >
            <Text style={styles.bubbleText}>{message.content}</Text>
          </View>
        ))}
        {isLoading ? <ActivityIndicator color="#fff" style={styles.spacer} /> : null}
      </View>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Ask the AI matchmaker…"
          placeholderTextColor="rgba(255,255,255,0.5)"
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendLabel}>Send</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  chatContainer: {
    flex: 1,
    gap: 12,
    paddingVertical: 12
  },
  bubble: {
    padding: 12,
    borderRadius: 16,
    maxWidth: "80%"
  },
  userBubble: {
    backgroundColor: "#7c3aed",
    alignSelf: "flex-end"
  },
  assistantBubble: {
    backgroundColor: "rgba(255,255,255,0.1)",
    alignSelf: "flex-start"
  },
  bubbleText: {
    color: "white"
  },
  spacer: {
    marginTop: 8
  },
  inputRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    paddingBottom: 16
  },
  input: {
    flex: 1,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 16,
    color: "white",
    height: 48
  },
  sendButton: {
    backgroundColor: "#f97316",
    borderRadius: 999,
    paddingHorizontal: 16,
    height: 48,
    alignItems: "center",
    justifyContent: "center"
  },
  sendLabel: {
    color: "white",
    fontWeight: "600"
  }
});

