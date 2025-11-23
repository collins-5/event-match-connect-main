import { Tabs } from "expo-router";
import { useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
  const scheme = useColorScheme();

  const tint = scheme === "dark" ? "#fff" : "#04030f";

  const renderIcon = (name: keyof typeof Ionicons.glyphMap) => () => (
    <Ionicons name={name} size={20} color={tint} />
  );

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: scheme === "dark" ? "#050318" : "#fff",
          borderTopColor: "transparent",
        },
        tabBarActiveTintColor: tint,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: renderIcon("home-outline"),
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: "Events",
          tabBarIcon: renderIcon("calendar-outline"),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          tabBarIcon: renderIcon("chatbubble-ellipses-outline"),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: renderIcon("person-outline"),
        }}
      />
    </Tabs>
  );
}
