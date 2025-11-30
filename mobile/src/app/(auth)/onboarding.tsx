import { OnboardingScreen } from "@/screens/OnboardingScreen";
import { StatusBar } from "expo-status-bar";

export default function OnboardingRoute() {
  return (
    <>
      <StatusBar style="dark" />

      <OnboardingScreen />
    </>
  );
}
