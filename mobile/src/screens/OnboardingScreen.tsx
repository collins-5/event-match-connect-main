import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { useRouter } from "expo-router";
import { useSession } from "@/hooks/useSession";
import { AppIntroScreen } from "./AppIntroScreen";

export const OnboardingScreen = () => {
  const router = useRouter();
  const { user, isLoading } = useSession();

  useEffect(() => {
    if (!isLoading && user) {
      console.log("🔐 User already authenticated, redirecting to home");
      router.replace("/(tabs)/home");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#04030f",
        }}
      >
        <ActivityIndicator size="large" color="#7c3aed" />
      </View>
    );
  }

  if (!user) {
    return <AppIntroScreen />;
  }

  return null;
};
