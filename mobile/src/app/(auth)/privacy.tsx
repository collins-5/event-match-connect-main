// app/(auth)/privacy.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Icon from "@/components/ui/icon";
import HeaderSafeAreaView from "~/components/core/header-safe-area-view";

export default function Privacy() {
  const router = useRouter();
  const [profileVisible, setProfileVisible] = useState(true);
  const [showLastSeen, setShowLastSeen] = useState(true);
  const [readReceipts, setReadReceipts] = useState(true);
  const [shareActivity, setShareActivity] = useState(false);

  const handleBlockedUsers = () => {
    Alert.alert("Blocked Users", "You have no blocked users at the moment.");
  };

  const handleDataSharing = () => {
    Alert.alert(
      "Data Sharing",
      "Control what data is shared with third parties and partners.",
      [{ text: "OK" }]
    );
  };

  const handleDownloadData = () => {
    Alert.alert(
      "Download My Data",
      "We'll prepare a copy of your data and email you a download link within 48 hours.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Request",
          onPress: () => Alert.alert("Success", "Data request submitted!"),
        },
      ]
    );
  };

  const handleActivityLog = () => {
    Alert.alert("Activity Log", "View your recent activity and interactions.");
  };

  const handleReportProblem = () => {
    Alert.alert("Report a Problem", "How can we help?", [
      { text: "Bug Report", onPress: () => {} },
      { text: "Report Content", onPress: () => {} },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleSafetyCenter = () => {
    Linking.openURL("https://eventmatch.com/safety");
  };

  const handlePrivacyPolicy = () => {
    Linking.openURL("https://eventmatch.com/privacy");
  };

  const handleTerms = () => {
    Linking.openURL("https://eventmatch.com/terms");
  };

  const SwitchItem = ({
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
      <Icon name="chevron-right" size={22} color="#999" />
    </TouchableOpacity>
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
          Privacy & Safety
        </Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Profile Privacy */}
        <View className="px-6 py-6">
          <Text className="text-sm font-semibold text-muted-foreground mb-4">
            PROFILE PRIVACY
          </Text>

          <SwitchItem
            icon="account-eye-outline"
            label="Profile Visibility"
            description="Make your profile visible to others"
            value={profileVisible}
            onValueChange={setProfileVisible}
          />

          <SwitchItem
            icon="clock-check-outline"
            label="Show Last Seen"
            description="Let others see when you were last active"
            value={showLastSeen}
            onValueChange={setShowLastSeen}
          />

          <SwitchItem
            icon="check-all"
            label="Read Receipts"
            description="Show when you've read messages"
            value={readReceipts}
            onValueChange={setReadReceipts}
          />

          <SwitchItem
            icon="heart-pulse"
            label="Share Activity Status"
            description="Share your event activity with connections"
            value={shareActivity}
            onValueChange={setShareActivity}
          />
        </View>

        {/* Data & Privacy */}
        <View className="px-6 py-6 border-t border-muted">
          <Text className="text-sm font-semibold text-muted-foreground mb-4">
            DATA & PRIVACY
          </Text>

          <MenuItem
            icon="account-lock-outline"
            label="Blocked Users"
            description="Manage blocked accounts"
            onPress={handleBlockedUsers}
          />

          <MenuItem
            icon="shield-account-outline"
            label="Data Sharing"
            description="Control what data you share"
            onPress={handleDataSharing}
          />

          <MenuItem
            icon="file-document-outline"
            label="Download My Data"
            description="Request a copy of your data"
            onPress={handleDownloadData}
          />

          <MenuItem
            icon="history"
            label="Activity Log"
            description="Review your activity history"
            onPress={handleActivityLog}
          />
        </View>

        {/* Safety */}
        <View className="px-6 py-6 border-t border-muted">
          <Text className="text-sm font-semibold text-muted-foreground mb-4">
            SAFETY
          </Text>

          <MenuItem
            icon="alert-circle-outline"
            label="Report a Problem"
            description="Report bugs or inappropriate content"
            onPress={handleReportProblem}
          />

          <MenuItem
            icon="shield-alert-outline"
            label="Safety Center"
            description="Learn about staying safe"
            onPress={handleSafetyCenter}
          />

          <MenuItem
            icon="scale-balance"
            label="Privacy Policy"
            description="Read our privacy policy"
            onPress={handlePrivacyPolicy}
          />

          <MenuItem
            icon="file-document-edit-outline"
            label="Terms of Service"
            description="Read our terms and conditions"
            onPress={handleTerms}
          />
        </View>

        <View className="h-32" />
      </ScrollView>
    </>
  );
}
