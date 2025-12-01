// app/(auth)/notifications-settings.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Icon from "@/components/ui/icon";
import HeaderSafeAreaView from "~/components/core/header-safe-area-view";

export default function NotificationsSettings() {
  const router = useRouter();
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [eventReminders, setEventReminders] = useState(true);
  const [newMatches, setNewMatches] = useState(true);
  const [messages, setMessages] = useState(true);
  const [eventUpdates, setEventUpdates] = useState(true);
  const [promotions, setPromotions] = useState(false);

  const NotificationItem = ({
    icon,
    label,
    description,
    value,
    onValueChange,
  }: {
    icon: string;
    label: string;
    description?: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
  }) => (
    <View className="flex-row items-center justify-between py-4 border-b border-muted/30">
      <View className="flex-1 flex-row items-center gap-3 pr-4">
        <Icon name={icon as any} size={22} color="rgb(4, 116, 56)" />
        <View className="flex-1">
          <Text className="text-foreground text-base font-medium">{label}</Text>
          {description && (
            <Text className="text-muted-foreground text-sm mt-1">
              {description}
            </Text>
          )}
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: "#d1d5db", true: "rgb(4, 116, 56)" }}
        thumbColor="#ffffff"
      />
    </View>
  );

  return (
    <>
    <HeaderSafeAreaView/>
      {/* Header */}
      <View className="flex-row items-center px-6 py-4 border-b border-muted">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Icon name="arrow-left" size={24} color="rgb(4, 116, 56)" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-foreground">
          Notifications
        </Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Notification Channels */}
        <View className="px-6 py-6">
          <Text className="text-sm font-semibold text-muted-foreground mb-4">
            NOTIFICATION CHANNELS
          </Text>

          <NotificationItem
            icon="bell-outline"
            label="Push Notifications"
            description="Receive notifications on this device"
            value={pushNotifications}
            onValueChange={setPushNotifications}
          />

          <NotificationItem
            icon="email-outline"
            label="Email Notifications"
            description="Receive notifications via email"
            value={emailNotifications}
            onValueChange={setEmailNotifications}
          />

          <NotificationItem
            icon="message-outline"
            label="SMS Notifications"
            description="Receive text message notifications"
            value={smsNotifications}
            onValueChange={setSmsNotifications}
          />
        </View>

        {/* Event Notifications */}
        <View className="px-6 py-6 border-t border-muted">
          <Text className="text-sm font-semibold text-muted-foreground mb-4">
            EVENT NOTIFICATIONS
          </Text>

          <NotificationItem
            icon="calendar-clock"
            label="Event Reminders"
            description="Get reminded before events start"
            value={eventReminders}
            onValueChange={setEventReminders}
          />

          <NotificationItem
            icon="account-heart-outline"
            label="New Matches"
            description="Notify when you match with someone"
            value={newMatches}
            onValueChange={setNewMatches}
          />

          <NotificationItem
            icon="chat-outline"
            label="Messages"
            description="Get notified about new messages"
            value={messages}
            onValueChange={setMessages}
          />

          <NotificationItem
            icon="update"
            label="Event Updates"
            description="Changes to events you're attending"
            value={eventUpdates}
            onValueChange={setEventUpdates}
          />
        </View>

        {/* Marketing */}
        <View className="px-6 py-6 border-t border-muted">
          <Text className="text-sm font-semibold text-muted-foreground mb-4">
            MARKETING
          </Text>

          <NotificationItem
            icon="gift-outline"
            label="Promotions & Offers"
            description="Special deals and promotions"
            value={promotions}
            onValueChange={setPromotions}
          />
        </View>

        {/* Quiet Hours */}
        <View className="px-6 py-6 border-t border-muted">
          <TouchableOpacity className="flex-row items-center justify-between py-4">
            <View className="flex-row items-center gap-3">
              <Icon
                name="moon-waning-crescent"
                size={22}
                color="rgb(4, 116, 56)"
              />
              <View>
                <Text className="text-foreground text-base font-medium">
                  Quiet Hours
                </Text>
                <Text className="text-muted-foreground text-sm mt-1">
                  Mute notifications during specific hours
                </Text>
              </View>
            </View>
            <Icon name="chevron-right" size={22} color="#999" />
          </TouchableOpacity>
        </View>

        <View className="h-32" />
      </ScrollView>
    </>
  );
}
