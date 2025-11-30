import { Tabs } from "expo-router";
import { Platform } from "react-native";
import Icon from "@/components/ui/icon";
import HeaderSafeAreaView from "~/components/core/header-safe-area-view";
import { StatusBar } from "expo-status-bar";

export default function TabsLayout() {
  // Use your custom color scheme
  const backgroundColor = "rgb(245, 245, 245)"; // bg-background
  const activeColor = "rgb(4, 116, 56)"; // primary
  const inactiveColor = "rgb(105, 105, 105)"; // muted-foreground

  return (
    <>
      <StatusBar style="light" />
      <HeaderSafeAreaView />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: backgroundColor,
            borderTopWidth: 1,
            borderTopColor: "rgb(211, 211, 211)", // muted
            height: Platform.OS === "ios" ? 88 : 65,
            paddingBottom: Platform.OS === "ios" ? 28 : 8,
            paddingTop: 8,
            elevation: 0,
            shadowOpacity: 0,
          },
          tabBarActiveTintColor: activeColor,
          tabBarInactiveTintColor: inactiveColor,
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "600",
            marginTop: 2,
          },
          tabBarItemStyle: {
            paddingVertical: 4,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            tabBarIcon: ({ focused }: { focused: boolean }) => (
              <Icon
                name="home-variant-outline"
                size={24}
                color={focused ? activeColor : inactiveColor}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="my-events"
          options={{
            title: "My Events",
            tabBarIcon: ({ focused }: { focused: boolean }) => (
              <Icon
                name="heart-outline"
                size={24}
                color={focused ? activeColor : inactiveColor}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="events"
          options={{
            title: "Events",
            tabBarIcon: ({ focused }: { focused: boolean }) => (
              <Icon
                name="calendar"
                size={24}
                color={focused ? activeColor : inactiveColor}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="chat"
          options={{
            title: "Chat",
            tabBarIcon: ({ focused }: { focused: boolean }) => (
              <Icon
                name="message-outline"
                size={24}
                color={focused ? activeColor : inactiveColor}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ focused }: { focused: boolean }) => (
              <Icon
                name="account-outline"
                size={24}
                color={focused ? activeColor : inactiveColor}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="public-profile"
          options={{
            title: "Profile",
            href: null,
            tabBarIcon: ({ focused }: { focused: boolean }) => (
              <Icon
                name="account-outline"
                size={24}
                color={focused ? activeColor : inactiveColor}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
