// app/(auth)/help.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Icon from "@/components/ui/icon";
import HeaderSafeAreaView from "~/components/core/header-safe-area-view";

export default function Help() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const MenuItem = ({
    icon,
    label,
    description,
    onPress,
  }: {
    icon: string;
    label: string;
    description?: string;
    onPress?: () => void;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center justify-between py-4 border-b border-muted/30"
    >
      <View className="flex-1 flex-row items-center gap-3 pr-4">
        <View className="w-10 h-10 bg-primary/10 rounded-lg items-center justify-center">
          <Icon name={icon as any} size={22} color="rgb(4, 116, 56)" />
        </View>
        <View className="flex-1">
          <Text className="text-foreground text-base font-medium">{label}</Text>
          {description && (
            <Text className="text-muted-foreground text-sm mt-1">
              {description}
            </Text>
          )}
        </View>
      </View>
      <Icon name="chevron-right" size={22} color="#999" />
    </TouchableOpacity>
  );

  const FAQItem = ({
    question,
    answer,
  }: {
    question: string;
    answer: string;
  }) => {
    const [expanded, setExpanded] = useState(false);

    return (
      <TouchableOpacity
        onPress={() => setExpanded(!expanded)}
        className="py-4 border-b border-muted/30"
      >
        <View className="flex-row items-center justify-between">
          <Text className="text-foreground text-base font-medium flex-1 pr-4">
            {question}
          </Text>
          <Icon
            name={expanded ? "chevron-up" : "chevron-down"}
            size={22}
            color="#999"
          />
        </View>
        {expanded && (
          <Text className="text-muted-foreground text-sm mt-3 leading-6">
            {answer}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  const handleContactSupport = () => {
    Linking.openURL("mailto:support@eventmatch.com");
  };

  const handleCallSupport = () => {
    Linking.openURL("tel:+1234567890");
  };

  return (
    <> <HeaderSafeAreaView/>
      {/* Header */}
      <View className="flex-row items-center px-6 py-4 border-b border-muted">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Icon name="arrow-left" size={24} color="rgb(4, 116, 56)" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-foreground">
          Help & Support
        </Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View className="px-6 py-6">
          <View className="flex-row items-center bg-muted/30 border border-muted rounded-xl px-4 py-3">
            <Icon name="magnify" size={20} color="#999" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="flex-1 ml-3 text-foreground"
              placeholder="Search for help..."
              placeholderTextColor="#999"
            />
          </View>
        </View>

        {/* Quick Actions */}
        <View className="px-6 py-4">
          <Text className="text-sm font-semibold text-muted-foreground mb-4">
            QUICK ACTIONS
          </Text>

          <MenuItem
            icon="email-outline"
            label="Contact Support"
            description="Get help via email"
            onPress={handleContactSupport}
          />

          <MenuItem
            icon="phone-outline"
            label="Call Support"
            description="Speak with our team"
            onPress={handleCallSupport}
          />

          <MenuItem
            icon="chat-outline"
            label="Live Chat"
            description="Chat with support agent"
            onPress={() => {}}
          />
        </View>

        {/* Resources */}
        <View className="px-6 py-6 border-t border-muted">
          <Text className="text-sm font-semibold text-muted-foreground mb-4">
            RESOURCES
          </Text>

          <MenuItem
            icon="book-open-variant"
            label="User Guide"
            description="Learn how to use EventMatch"
            onPress={() => {}}
          />

          <MenuItem
            icon="video-outline"
            label="Video Tutorials"
            description="Watch step-by-step guides"
            onPress={() => {}}
          />

          <MenuItem
            icon="forum-outline"
            label="Community Forum"
            description="Connect with other users"
            onPress={() => {}}
          />

          <MenuItem
            icon="update"
            label="What's New"
            description="Latest features and updates"
            onPress={() => {}}
          />
        </View>

        {/* FAQs */}
        <View className="px-6 py-6 border-t border-muted">
          <Text className="text-sm font-semibold text-muted-foreground mb-4">
            FREQUENTLY ASKED QUESTIONS
          </Text>

          <FAQItem
            question="How do I create an event?"
            answer="To create an event, tap the '+' button on the home screen, fill in the event details including title, date, time, location, and description, then tap 'Create Event'."
          />

          <FAQItem
            question="How does event matching work?"
            answer="EventMatch uses your interests, location, and preferences to suggest events you might enjoy. When you attend events, we learn more about your preferences to provide better recommendations."
          />

          <FAQItem
            question="Can I cancel my RSVP?"
            answer="Yes, you can cancel your RSVP anytime before the event starts. Go to the event page and tap 'Cancel RSVP'. Please note that some events may have cancellation policies."
          />

          <FAQItem
            question="How do I report inappropriate content?"
            answer="Tap the three dots menu on any event or profile, select 'Report', choose the reason, and submit. Our team will review reports within 24 hours."
          />

          <FAQItem
            question="Is my data secure?"
            answer="Yes, we use industry-standard encryption to protect your data. Read our Privacy Policy for detailed information about how we handle your data."
          />
        </View>

        {/* App Info */}
        <View className="px-6 py-6 border-t border-muted">
          <Text className="text-sm font-semibold text-muted-foreground mb-4">
            APP INFORMATION
          </Text>

          <View className="py-3 border-b border-muted/30">
            <Text className="text-muted-foreground text-sm">Version</Text>
            <Text className="text-foreground text-base mt-1">1.0.0</Text>
          </View>

          <TouchableOpacity className="py-3 border-b border-muted/30">
            <Text className="text-muted-foreground text-sm">Rate Us</Text>
            <Text className="text-primary text-base mt-1">Leave a review</Text>
          </TouchableOpacity>

          <TouchableOpacity className="py-3">
            <Text className="text-muted-foreground text-sm">Share App</Text>
            <Text className="text-primary text-base mt-1">
              Tell your friends about EventMatch
            </Text>
          </TouchableOpacity>
        </View>

        <View className="h-32" />
      </ScrollView>
    </>
  );
}
