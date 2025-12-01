// app/(tabs)/chat/[id].tsx

import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import Icon from "@/components/ui/icon";
import { useSingleChat } from "~/hooks/useSingleChat";

// Helper: Generate initials from name
const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
};

// Optional: Simple color hash for consistent avatar background
const stringToColor = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 50%)`;
};

export default function SingleChat() {
  const router = useRouter();
  const scrollRef = useRef<any>(null);
  const { chatName, messages } = useSingleChat();

  const initials = getInitials(chatName);
  const avatarBgColor = stringToColor(chatName);

  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: false }), 100);
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-background"
      keyboardVerticalOffset={90}
    >
      {/* Header with Initials Avatar */}
      <View className="flex-row items-center bg-primary px-5 py-4 border-b border-muted">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <Icon
            name="arrow-left"
            size={26}
            className="text-primary-foreground"
          />
        </TouchableOpacity>

        {/* Avatar with Initials */}
        <View
          className="w-11 h-11 rounded-full items-center justify-center mr-3"
          style={{ backgroundColor: avatarBgColor }}
        >
          <Text className="text-white font-bold text-lg tracking-wider">
            {initials}
          </Text>
        </View>

        {/* Name + Status */}
        <View className="flex-1">
          <Text className="text-primary-foreground font-bold text-lg">
            {chatName}
          </Text>
          <Text className="text-primary-foreground text-xs font-medium">
            Online
          </Text>
        </View>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollRef}
        className="flex-1"
        contentContainerStyle={{ paddingVertical: 16, paddingHorizontal: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((msg) => (
          <View
            key={msg.id}
            className={`flex-row gap-3 my-2 ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.role === "friend" && (
              <View
                className="w-10 h-10 rounded-full items-center justify-center"
                style={{ backgroundColor: stringToColor(chatName) }}
              >
                <Text className="text-white font-bold text-sm">{initials}</Text>
              </View>
            )}

            <View className="max-w-[78%]">
              <View
                className={`p-4 rounded-2xl ${
                  msg.role === "user"
                    ? "bg-primary rounded-br-none"
                    : "bg-card border border-muted rounded-bl-none"
                }`}
              >
                <Text
                  className={`text-base leading-6 ${
                    msg.role === "user" ? "text-white" : "text-foreground"
                  }`}
                >
                  {msg.content}
                </Text>
              </View>
              <Text className="text-xs text-muted-foreground mt-1 px-2">
                {msg.time}
              </Text>
            </View>

            {msg.role === "user" && (
              <View className="w-10 h-10 rounded-full bg-primary items-center justify-center">
                <Text className="text-white font-bold text-sm">YOU</Text>
                {/* Or use your own initials: getInitials("Your Name") */}
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {/* Fake Input */}
      <View className="border-t border-muted bg-background px-4 py-3">
        <View className="flex-row items-center gap-3">
          <View className="flex-1 bg-card border border-muted rounded-full px-4 h-12 justify-center">
            <Text className="text-muted-foreground">Type a message...</Text>
          </View>
          <View className="bg-primary/20 rounded-full w-12 h-12 items-center justify-center">
            <Icon name="send" size={20} color="rgb(4, 116, 56)" />
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
