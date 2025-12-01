// app/(auth)/preferences.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  useColorScheme,
} from "react-native";
import { useRouter } from "expo-router";
import Icon from "@/components/ui/icon";
import HeaderSafeAreaView from "~/components/core/header-safe-area-view";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Preferences() {
  const router = useRouter();
  const systemColorScheme = useColorScheme();
  const [darkMode, setDarkMode] = useState(systemColorScheme === "dark");
  const [autoPlay, setAutoPlay] = useState(true);
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  const [location, setLocation] = useState("Karuri, Kenya");
  const [language, setLanguage] = useState("English");
  const [distance, setDistance] = useState("50 km");

  // Load saved theme preference on mount
  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem("theme");
      if (savedTheme !== null) {
        setDarkMode(savedTheme === "dark");
      }
    } catch (error) {
      console.error("Error loading theme preference:", error);
    }
  };

  const toggleDarkMode = async (value: boolean) => {
    setDarkMode(value);
    try {
      await AsyncStorage.setItem("theme", value ? "dark" : "light");
      // Apply theme to document
      if (typeof document !== "undefined") {
        if (value) {
          document.documentElement.classList.add("dark");
          document.documentElement.classList.remove("light");
        } else {
          document.documentElement.classList.add("light");
          document.documentElement.classList.remove("dark");
        }
      }
    } catch (error) {
      console.error("Error saving theme preference:", error);
    }
  };

  const handleThemeColor = () => {
    Alert.alert("Theme Color", "Choose your preferred theme color", [
      { text: "Green", onPress: () => {} },
      { text: "Blue", onPress: () => {} },
      { text: "Purple", onPress: () => {} },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleLocation = () => {
    Alert.alert(
      "Change Location",
      "Select a new location for event discovery",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Update", onPress: () => {} },
      ]
    );
  };

  const handleDistance = () => {
    Alert.alert(
      "Maximum Distance",
      "How far are you willing to travel for events?",
      [
        { text: "10 km", onPress: () => setDistance("10 km") },
        { text: "25 km", onPress: () => setDistance("25 km") },
        { text: "50 km", onPress: () => setDistance("50 km") },
        { text: "100 km", onPress: () => setDistance("100 km") },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  const handleDownloadQuality = () => {
    Alert.alert("Download Quality", "Choose media download quality", [
      { text: "Low", onPress: () => {} },
      { text: "Medium", onPress: () => {} },
      { text: "High", onPress: () => {} },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleLanguage = () => {
    Alert.alert("Language", "Select your preferred language", [
      { text: "English", onPress: () => setLanguage("English") },
      { text: "Swahili", onPress: () => setLanguage("Swahili") },
      { text: "French", onPress: () => setLanguage("French") },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleClearCache = () => {
    Alert.alert(
      "Clear Cache",
      "This will free up storage space but may slow down the app temporarily.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => Alert.alert("Success", "Cache cleared successfully!"),
        },
      ]
    );
  };

  const handleTimeZone = () => {
    Alert.alert("Time Zone", "Select your time zone", [
      { text: "EAT (GMT+3)", onPress: () => {} },
      { text: "WAT (GMT+1)", onPress: () => {} },
      { text: "CAT (GMT+2)", onPress: () => {} },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleDateFormat = () => {
    Alert.alert("Date Format", "Choose your preferred date format", [
      { text: "DD/MM/YYYY", onPress: () => {} },
      { text: "MM/DD/YYYY", onPress: () => {} },
      { text: "YYYY-MM-DD", onPress: () => {} },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleStorageUsage = () => {
    Alert.alert(
      "Storage Usage",
      "EventMatch is using 125 MB of storage:\n\n• Images: 80 MB\n• Cache: 30 MB\n• Data: 15 MB",
      [{ text: "OK" }]
    );
  };

  const PreferenceItem = ({
    icon,
    label,
    value,
    onPress,
    showChevron = true,
  }: {
    icon: string;
    label: string;
    value?: string;
    onPress?: () => void;
    showChevron?: boolean;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center justify-between py-4 border-b border-muted/30"
      disabled={!onPress}
    >
      <View className="flex-row items-center gap-3 flex-1">
        <Icon name={icon as any} size={22} color="rgb(4, 116, 56)" />
        <Text className="text-foreground text-base font-medium">{label}</Text>
      </View>
      <View className="flex-row items-center gap-2">
        {value && (
          <Text className="text-muted-foreground text-sm">{value}</Text>
        )}
        {showChevron && <Icon name="chevron-right" size={22} color="#999" />}
      </View>
    </TouchableOpacity>
  );

  const SwitchItem = ({
    icon,
    label,
    description,
    value,
    onValueChange,
  }: {
    icon: string;
    label: string;
    description?: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
  }) => (
    <View className="flex-row items-center justify-between py-4 border-b border-muted/30">
      <View className="flex-1 flex-row items-center gap-3 pr-4">
        <Icon name={icon as any} size={22} color="rgb(4, 116, 56)" />
        <View className="flex-1">
          <Text className="text-foreground text-base font-medium">{label}</Text>
          {description && (
            <Text className="text-muted-foreground text-sm mt-1">
              {description}
            </Text>
          )}
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: "#d1d5db", true: "rgb(4, 116, 56)" }}
        thumbColor="#ffffff"
      />
    </View>
  );

  return (
    <>
      <HeaderSafeAreaView />
      {/* Header */}
      <View className="flex-row items-center px-6 py-4 border-b border-muted bg-background">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Icon name="arrow-left" size={24} color="rgb(4, 116, 56)" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-foreground">Preferences</Text>
      </View>

      <ScrollView
        className="flex-1 bg-background"
        showsVerticalScrollIndicator={false}
      >
        {/* Appearance */}
        <View className="px-6 py-6">
          <Text className="text-sm font-semibold text-muted-foreground mb-4">
            APPEARANCE
          </Text>

          <SwitchItem
            icon="theme-light-dark"
            label="Dark Mode"
            description="Use dark theme throughout the app"
            value={darkMode}
            onValueChange={toggleDarkMode}
          />

          <PreferenceItem
            icon="palette-outline"
            label="Theme Color"
            value="Green"
            onPress={handleThemeColor}
          />
        </View>

        {/* Location & Discovery */}
        <View className="px-6 py-6 border-t border-muted">
          <Text className="text-sm font-semibold text-muted-foreground mb-4">
            LOCATION & DISCOVERY
          </Text>

          <PreferenceItem
            icon="map-marker-outline"
            label="Location"
            value={location}
            onPress={handleLocation}
          />

          <PreferenceItem
            icon="map-marker-distance"
            label="Maximum Distance"
            value={distance}
            onPress={handleDistance}
          />

          <SwitchItem
            icon="eye-outline"
            label="Show Online Status"
            description="Let others see when you're online"
            value={showOnlineStatus}
            onValueChange={setShowOnlineStatus}
          />
        </View>

        {/* Media & Content */}
        <View className="px-6 py-6 border-t border-muted">
          <Text className="text-sm font-semibold text-muted-foreground mb-4">
            MEDIA & CONTENT
          </Text>

          <SwitchItem
            icon="play-circle-outline"
            label="Auto-play Videos"
            description="Videos start playing automatically"
            value={autoPlay}
            onValueChange={setAutoPlay}
          />

          <PreferenceItem
            icon="download-outline"
            label="Download Quality"
            value="High"
            onPress={handleDownloadQuality}
          />
        </View>

        {/* Language & Region */}
        <View className="px-6 py-6 border-t border-muted">
          <Text className="text-sm font-semibold text-muted-foreground mb-4">
            LANGUAGE & REGION
          </Text>

          <PreferenceItem
            icon="translate"
            label="Language"
            value={language}
            onPress={handleLanguage}
          />

          <PreferenceItem
            icon="clock-outline"
            label="Time Zone"
            value="EAT (GMT+3)"
            onPress={handleTimeZone}
          />

          <PreferenceItem
            icon="calendar-outline"
            label="Date Format"
            value="DD/MM/YYYY"
            onPress={handleDateFormat}
          />
        </View>

        {/* Data & Storage */}
        <View className="px-6 py-6 border-t border-muted">
          <Text className="text-sm font-semibold text-muted-foreground mb-4">
            DATA & STORAGE
          </Text>

          <PreferenceItem
            icon="database-outline"
            label="Clear Cache"
            onPress={handleClearCache}
          />

          <PreferenceItem
            icon="storage"
            label="Storage Usage"
            value="125 MB"
            onPress={handleStorageUsage}
          />
        </View>

        <View className="h-32" />
      </ScrollView>
    </>
  );
}
