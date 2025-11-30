import { Redirect } from "expo-router";
import "./../../global.css";

import { useSession } from "@/hooks/useSession";

export default function IndexRoute() {
  const { user, isLoading } = useSession();

  if (isLoading) {
    return null;
  }

  if (!user) {
    return <Redirect href="/(auth)/onboarding" />;
  }

  return <Redirect href="/(tabs)/home" />;
}
