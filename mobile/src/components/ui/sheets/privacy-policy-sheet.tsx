// src/components/sheets/PrivacyPolicySheet.tsx
import React from "react";
import { Text, View } from "react-native";
import { BottomSheetModal } from "./filter-bottom-sheet";
import { ScrollView } from "react-native-actions-sheet";

type Props = {
  visible: boolean;
  onClose: () => void;
};

export const PrivacyPolicySheet = ({ visible, onClose }: Props) => {
  return (
    <BottomSheetModal
      visible={visible}
      title="Privacy Policy"
      heightMode="full"
      showDragHandle={true}
      showCloseButton={true}
      onClose={onClose}
    >
      <ScrollView className="gap-5">
        <Text className="text-foreground text-base leading-6">
          <Text className="font-bold">Last updated:</Text> November 27, 2025
        </Text>

        <Text className="text-foreground leading-7">
          We take your privacy seriously. This policy explains what we collect
          and how we use it.
        </Text>

        <View className="gap-3">
          <Text className="text-lg font-bold text-primary">
            1. What We Collect
          </Text>
          <Text className="text-foreground/90 leading-6">
            • Your name, photo, interests, and bio{"\n"}• Events you’re
            interested in or attending{"\n"}• Messages you send{"\n"}• Location
            (only if you allow it){"\n"}• Device info and usage data
          </Text>
        </View>

        <View className="gap-3">
          <Text className="text-lg font-bold text-primary">
            2. How We Use It
          </Text>
          <Text className="text-foreground/90 leading-6">
            • Show you relevant events and people{"\n"}• Enable messaging and
            friend connections{"\n"}• Improve recommendations{"\n"}• Keep the
            app safe and spam-free
          </Text>
        </View>

        <View className="gap-3">
          <Text className="text-lg font-bold text-primary">3. Sharing</Text>
          <Text className="text-foreground/90 leading-6">
            We <Text className="font-bold">never sell</Text> your data.{"\n"}
            Your profile and event attendance are visible to other users by
            default.
          </Text>
        </View>

        <View className="gap-3">
          <Text className="text-lg font-bold text-primary">
            4. Your Control
          </Text>
          <Text className="text-foreground/90 leading-6">
            • Edit or delete your profile anytime{"\n"}• Turn off location{"\n"}
            • Delete your account permanently{"\n"}• Request your data
          </Text>
        </View>

        <View className="gap-3">
          <Text className="text-lg font-bold text-primary">5. Security</Text>
          <Text className="text-foreground/90 leading-6">
            We use encryption and industry-standard security. But no app is 100%
            secure — use wisely.
          </Text>
        </View>

        <Text className="text-foreground/80 text-sm italic mt-6">
          We’re building EventMatch to help you make real friends — safely and
          privately.
        </Text>
        
      </ScrollView>
    </BottomSheetModal>
  );
};
