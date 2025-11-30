import { AuthScreen } from "@/screens/AuthScreen";
import { StatusBar } from "expo-status-bar";
import SignInScreen from "~/screens/SignInScreen";

export default function SignInRoute() {
  return (
    <>
      <StatusBar style="dark" />
      <SignInScreen />
    </>
  );
}
