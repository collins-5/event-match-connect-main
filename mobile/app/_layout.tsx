import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import "./../global.css";

import { AppProviders } from "@/providers/AppProviders";
import HeaderSafeAreaView from "~/components/core/header-safe-area-view";

export default function RootLayout() {
  return (
    <>
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#04030f" }}>
        <AppProviders>
          <StatusBar style="light" />
          <HeaderSafeAreaView />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="(auth)" options={{ presentation: "modal" }} />
            <Stack.Screen
              name="event/[id]"
              options={{
                presentation: "card",
                  
              }}
            />
          </Stack>
        </AppProviders>
      </GestureHandlerRootView>
    </>
  );
}
