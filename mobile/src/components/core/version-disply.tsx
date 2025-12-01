// src/components/core/VersionDisplay.tsx

import { View, Text, Platform } from "react-native";
import Constants from "expo-constants";
import * as Application from "expo-application";

export default function VersionDisplay() {
  // This works in Expo Go AND production builds
  const appVersion =
    Constants.expoConfig?.version ||
    Application.nativeApplicationVersion ||
    "1.0.0";
  const buildVersion =
    Constants.expoConfig?.version || Application.nativeBuildVersion || "dev";

  const buildNumber =
    Platform.OS === "ios"
      ? Application.nativeBuildVersion
      : Application.nativeApplicationVersion;

  return (
    <View className="items-start py-4">
      <Text className="text-muted-foreground text-xs">
        Version {appVersion} 
        • Build {buildNumber || buildVersion}
      </Text>
    </View>
  );
}
