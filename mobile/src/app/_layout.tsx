import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import "./../../global.css";

import { AppProviders } from "@/providers/AppProviders";
import HeaderSafeAreaView from "~/components/core/header-safe-area-view";
import { SheetProvider } from "react-native-actions-sheet";
import SafeAreaWrapper from "~/components/core/safe-area-wrapper";

export default function RootLayout() {
  return (
    <>
      <SheetProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaWrapper>
            <AppProviders>
              <StatusBar style="light" />
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="(tabs)" />
                <Stack.Screen
                  name="(auth)"
                  options={{ presentation: "modal" }}
                />
                <Stack.Screen
                  name="event/[id]"
                  options={{
                    presentation: "card",
                  }}
                />
              </Stack>
            </AppProviders>
          </SafeAreaWrapper>
        </GestureHandlerRootView>
      </SheetProvider>
    </>
  );
}
