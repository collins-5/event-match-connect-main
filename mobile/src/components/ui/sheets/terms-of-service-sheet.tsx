// src/components/sheets/TermsOfServiceSheet.tsx
import React from "react";
import { Text, View } from "react-native";
import { BottomSheetModal } from "./filter-bottom-sheet";

type Props = {
  visible: boolean;
  onClose: () => void;
};

export const TermsOfServiceSheet = ({ visible, onClose }: Props) => {
  return (
    <BottomSheetModal
      visible={visible}
      title="Terms of Service"
      heightMode="full"
      showDragHandle={true}
      showCloseButton={true}
      onClose={onClose}
    >
      <View className="gap-5">
        <Text className="text-foreground text-base leading-6">
          <Text className="font-bold">Last updated:</Text> November 27, 2025
        </Text>

        <Text className="text-foreground leading-7">
          Welcome to <Text className="font-bold">EventMatch</Text>! By using our
          app, you agree to these Terms of Service.
        </Text>

        <View className="gap-3">
          <Text className="text-lg font-bold text-primary">1. Eligibility</Text>
          <Text className="text-foreground/90 leading-6">
            You must be at least 13 years old. Users under 18 need parental
            consent.
          </Text>
        </View>

        <View className="gap-3">
          <Text className="text-lg font-bold text-primary">
            2. Your Responsibilities
          </Text>
          <Text className="text-foreground/90 leading-6">
            • Be respectful — no harassment, hate speech, or bullying{"\n"}• No
            fake profiles or impersonation{"\n"}• No illegal, dangerous, or
            explicit content{"\n"}• Attend events at your own risk — we don’t
            host them
          </Text>
        </View>

        <View className="gap-3">
          <Text className="text-lg font-bold text-primary">
            3. Events & Safety
          </Text>
          <Text className="text-foreground/90 leading-6">
            EventMatch helps you discover events and connect with attendees. We
            do not organize or verify events. Your safety is your
            responsibility.
          </Text>
        </View>

        <View className="gap-3">
          <Text className="text-lg font-bold text-primary">4. Messaging</Text>
          <Text className="text-foreground/90 leading-6">
            Chats are private, but we may review them to prevent abuse. Report
            any harassment immediately.
          </Text>
        </View>

        <View className="gap-3">
          <Text className="text-lg font-bold text-primary">
            5. Account & Termination
          </Text>
          <Text className="text-foreground/90 leading-6">
            We can suspend or delete accounts that violate these rules. You can
            delete your account anytime in Settings.
          </Text>
        </View>

        <View className="gap-3">
          <Text className="text-lg font-bold text-primary">6. Changes</Text>
          <Text className="text-foreground/90 leading-6">
            We may update these Terms. Major changes will be notified in-app or
            via email.
          </Text>
        </View>

        <Text className="text-foreground/80 text-sm italic mt-6">
          Thank you for helping make EventMatch a safe and fun place to meet
          people at events
        </Text>
      </View>
    </BottomSheetModal>
  );
};
