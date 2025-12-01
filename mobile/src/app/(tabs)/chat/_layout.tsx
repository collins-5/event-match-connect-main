// app/(tabs)/chat/_layout.tsx

import { Stack } from "expo-router";
import HeaderSafeAreaView from "~/components/core/header-safe-area-view";

export default function ChatLayout() {
  return (
    <>
    <HeaderSafeAreaView/>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Chat Inbox */}
        <Stack.Screen
          name="index"
          options={{
            title: "Messages",
            // Optional: you can show a custom header here later
          }}
        />

        {/* Single Conversation */}
        <Stack.Screen
          name="[id]"
          options={{
            // Dynamic title (we'll set it inside the screen)
            headerShown: false,
            presentation: "card",
            animation: "slide_from_right",
          }}
        />
      </Stack>
    </>
  );
}
