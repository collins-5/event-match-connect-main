import { useState, useRef, useEffect } from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
// Removed react-native-reanimated usage per request

import { Screen } from "@/components/Screen";
import { useChatStream } from "@/hooks/useChatStream";
import Icon from "~/components/ui/icon";

// PulseDot removed; using static dots instead

export const ChatScreen = () => {
  const [input, setInput] = useState("");
  const scrollRef = useRef<any>(null);
  const { messages, isLoading, sendMessage } = useChatStream();

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollRef.current) {
      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const message = input.trim();
    setInput("");
    await sendMessage(message);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-background"
      keyboardVerticalOffset={90}
    >
      <View className="flex-1">
        <ScrollView
          ref={scrollRef}
          className="flex-1"
          contentContainerStyle={{
            paddingVertical: 16,
            paddingHorizontal: 16,
            gap: 16,
          }}
          showsVerticalScrollIndicator={false}
        >
          {messages.length === 0 && (
            <View className="items-center justify-center py-12">
              <View className="bg-primary/10 w-20 h-20 rounded-full items-center justify-center mb-6">
                <Icon
                  name="account-question"
                  size={40}
                  color="rgb(4, 116, 56)"
                />
              </View>
              <Text className="text-foreground text-xl font-bold mb-3 text-center">
                Welcome to MatchBot!
              </Text>
              <Text className="text-muted-foreground text-base text-center leading-6 px-8">
                I can help you find events, suggest connections, and answer
                questions about EventMatch!
              </Text>

              {/* Quick Actions */}
              <View className="mt-8 gap-2 w-full">
                <TouchableOpacity
                  className="bg-card border border-muted rounded-2xl p-4"
                  onPress={() => setInput("Find events near me")}
                >
                  <View className="flex-row items-center gap-3">
                    <Icon
                      name="map-marker-radius-outline"
                      size={20}
                      color="rgb(4, 116, 56)"
                    />
                    <Text className="text-foreground font-medium">
                      Find events near me
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  className="bg-card border border-muted rounded-2xl p-4"
                  onPress={() => setInput("Show upcoming events")}
                >
                  <View className="flex-row items-center gap-3">
                    <Icon name="calendar" size={20} color="rgb(4, 116, 56)" />
                    <Text className="text-foreground font-medium">
                      Show upcoming events
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  className="bg-card border border-muted rounded-2xl p-4"
                  onPress={() => setInput("Help me connect with people")}
                >
                  <View className="flex-row items-center gap-3">
                    <Icon
                      name="account-group"
                      size={20}
                      color="rgb(4, 116, 56)"
                    />
                    <Text className="text-foreground font-medium">
                      Help me connect with people
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {messages.map((message, index) => (
            <View
              key={index}
              className={`flex-row gap-3 ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.role === "assistant" && (
                <View className="w-10 h-10 rounded-full bg-primary/20 items-center justify-center flex-shrink-0 mt-1">
                  <Icon
                    name="account-question"
                    size={22}
                    color="rgb(4, 116, 56)"
                  />
                </View>
              )}

              <View
                className={`p-4 rounded-2xl max-w-[75%] ${
                  message.role === "user"
                    ? "bg-primary rounded-br-sm"
                    : "bg-card border border-muted rounded-bl-sm"
                }`}
              >
                <Text
                  className={`text-base leading-6 ${
                    message.role === "user"
                      ? "text-primary-foreground"
                      : "text-foreground"
                  }`}
                >
                  {message.content || "..."}
                </Text>
              </View>

              {message.role === "user" && (
                <View className="w-10 h-10 rounded-full bg-primary items-center justify-center flex-shrink-0 mt-1">
                  <Icon
                    name="account-outline"
                    size={22}
                    color="rgb(255, 255, 255)"
                  />
                </View>
              )}
            </View>
          ))}

          {isLoading && messages.length > 0 && (
            <View className="flex-row gap-3 justify-start">
              <View className="w-10 h-10 rounded-full bg-primary/20 items-center justify-center flex-shrink-0 mt-1">
                <Icon
                  name="account-question"
                  size={22}
                  color="rgb(4, 116, 56)"
                />
              </View>
              <View className="bg-card border border-muted p-4 rounded-2xl rounded-bl-sm">
                <View className="flex-row gap-2 items-center">
                  <View className="w-2 h-2 rounded-full bg-primary" />
                  <View className="w-2 h-2 rounded-full bg-primary" />
                  <View className="w-2 h-2 rounded-full bg-primary" />
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Input Area */}
        <View className="border-t border-muted bg-background px-4 py-3">
          <View className="flex-row gap-3 items-center">
            <View className="flex-1 flex-row items-center bg-card border border-muted rounded-full px-4 h-12">
              <TextInput
                className="flex-1 text-foreground text-base"
                placeholder="Ask MatchBot anything..."
                placeholderTextColor="rgb(105, 105, 105)"
                value={input}
                onChangeText={setInput}
                editable={!isLoading}
                onSubmitEditing={handleSend}
                returnKeyType="send"
              />
            </View>

            <TouchableOpacity
              className={`bg-primary rounded-full w-12 h-12 items-center justify-center ${
                isLoading || !input.trim() ? "opacity-50" : ""
              }`}
              onPress={handleSend}
              disabled={isLoading || !input.trim()}
              style={{
                shadowColor: "rgb(4, 116, 56)",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 4,
              }}
            >
              {isLoading ? (
                <ActivityIndicator color="rgb(255, 255, 255)" size="small" />
              ) : (
                <Icon name="send" size={20} color="rgb(255, 255, 255)" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};
