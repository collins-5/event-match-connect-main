// app/(tabs)/chat/index.tsx

import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import HeaderSafeAreaView from "~/components/core/header-safe-area-view";
import { useChatInbox } from "~/hooks/useChatInbox";

// Helper: Generate initials
const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
};

// Helper: Generate consistent color from name
const stringToColor = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 70%, 55%)`;
};

export default function ChatInbox() {
  const { conversations, openChat } = useChatInbox();

  return (
    <>
      <HeaderSafeAreaView />

      {/* Header */}
      <View className="px-6 py-3 bg-primary">
        <Text className="text-3xl font-bold text-primary-foreground">
          Messages
        </Text>
      </View>

      <ScrollView className="flex-1 bg-background">
        {conversations.map((conv) => {
          const initials = getInitials(conv.name);
          const avatarColor = stringToColor(conv.name);

          return (
            <TouchableOpacity
              key={conv.id}
              className="flex-row items-center px-6 py-4 border-b border-muted/50 active:bg-muted/50"
              onPress={() => openChat(conv.id)}
            >
              {/* Avatar with Initials */}
              <View
                className="w-14 h-14 rounded-full items-center justify-center mr-4 shadow-sm"
                style={{ backgroundColor: avatarColor }}
              >
                <Text className="text-white font-bold text-lg tracking-wider">
                  {initials}
                </Text>
              </View>

              {/* Content */}
              <View className="flex-1">
                <View className="flex-row justify-between items-baseline">
                  <Text className="text-foreground font-semibold text-lg">
                    {conv.name}
                  </Text>
                  <Text className="text-muted-foreground text-xs">
                    {conv.time}
                  </Text>
                </View>
                <Text
                  className={`text-sm mt-1 ${
                    conv.unread > 0
                      ? "text-foreground font-medium"
                      : "text-muted-foreground"
                  }`}
                  numberOfLines={1}
                >
                  {conv.lastMessage}
                </Text>
              </View>

              {/* Unread Badge */}
              {conv.unread > 0 && (
                <View className="bg-primary rounded-full min-w-6 h-6 items-center justify-center px-2 ml-3">
                  <Text className="text-white text-xs font-bold">
                    {conv.unread > 99 ? "99+" : conv.unread}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </>
  );
}
