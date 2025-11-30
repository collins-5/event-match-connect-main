import { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import Icon from "@/components/ui/icon";

import { supabase } from "@/lib/supabase";

const INTEREST_OPTIONS = [
  { name: "Music", icon: "microphone" as const },
  { name: "Sports", icon: "arm-flex" as const },
  { name: "Art", icon: "image" as const },
  { name: "Food", icon: "food-apple" as const },
  { name: "Technology", icon: "access-point" as const },
  { name: "Gaming", icon: "view-module" as const },
  { name: "Fitness", icon: "arm-flex" as const },
  { name: "Travel", icon: "earth" as const },
  { name: "Photography", icon: "camera" as const },
  { name: "Reading", icon: "clipboard-text" as const },
  { name: "Movies", icon: "video-outline" as const },
  { name: "Dancing", icon: "account-group" as const },
];

export const ProfileSetupScreen = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState("");
  const [age, setAge] = useState("");
  const [interests, setInterests] = useState<string[]>([]);

  const toggleInterest = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleContinue = async () => {
    if (!location.trim() || !age.trim()) {
      Alert.alert("Required Fields", "Please fill in all fields");
      return;
    }

    setStep(2);
  };

  const handleComplete = async () => {
    if (interests.length === 0) {
      Alert.alert("Select Interests", "Please select at least one interest");
      return;
    }

    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      console.log("🔐 Updating profile for user:", user.id);

      // Update profile
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          location: location.trim(),
          age: parseInt(age) || null,
        })
        .eq("id", user.id);

      if (profileError) throw profileError;

      // Add interests
      const interestInserts = interests.map((interest) => ({
        user_id: user.id,
        interest,
      }));

      const { error: interestsError } = await supabase
        .from("user_interests")
        .insert(interestInserts);

      if (interestsError) throw interestsError;

      console.log("✅ Profile setup complete for user:", user.id);
      Alert.alert("Success", "Profile setup complete!");

      router.replace("/(tabs)/home");
    } catch (error: any) {
      console.error("❌ Profile setup error:", error);
      Alert.alert(
        "Error",
        "Failed to save profile: " + (error.message || "Unknown error")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    } else {
      router.back();
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-background"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View className="flex-1 px-6 py-10">
        {/* Progress */}
        <View className="mb-8">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-muted-foreground text-sm font-medium">
              Step {step} of 2
            </Text>
            <Text className="text-primary text-sm font-semibold">
              {step === 1 ? "50%" : "100%"}
            </Text>
          </View>
          <View className="flex-row gap-2 h-2">
            <View
              className={`flex-1 rounded-full ${
                step >= 1 ? "bg-primary" : "bg-muted"
              }`}
            />
            <View
              className={`flex-1 rounded-full ${
                step >= 2 ? "bg-primary" : "bg-muted"
              }`}
            />
          </View>
        </View>

        {/* Header */}
        <View className="mb-8">
          <View className="bg-primary/20 w-16 h-16 rounded-2xl items-center justify-center mb-4">
            <Icon
              name={step === 1 ? "account-edit" : "heart"}
              size={32}
              color="rgb(4, 116, 56)"
            />
          </View>
          <Text className="text-3xl font-black text-foreground mb-2">
            {step === 1 ? "Tell us about yourself" : "What interests you?"}
          </Text>
          <Text className="text-base text-muted-foreground leading-6">
            {step === 1
              ? "Help us personalize your experience"
              : "Select your interests to find matching events"}
          </Text>
        </View>

        {/* Content */}
        <View className="mb-10 flex-1">
          {step === 1 ? (
            <View className="gap-5">
              <View>
                <View className="flex-row items-center gap-2 mb-2">
                  <Icon
                    name="map-marker-radius-outline"
                    size={16}
                    color="rgb(105, 105, 105)"
                  />
                  <Text className="text-muted-foreground font-semibold text-sm">
                    Location
                  </Text>
                </View>
                <View className="bg-card border border-muted rounded-2xl px-4 py-3.5 flex-row items-center">
                  <TextInput
                    className="flex-1 text-foreground text-base"
                    placeholder="e.g., San Francisco, CA"
                    placeholderTextColor="rgb(105, 105, 105)"
                    value={location}
                    onChangeText={setLocation}
                    editable={!loading}
                  />
                </View>
              </View>

              <View>
                <View className="flex-row items-center gap-2 mb-2">
                  <Icon name="calendar" size={16} color="rgb(105, 105, 105)" />
                  <Text className="text-muted-foreground font-semibold text-sm">
                    Age
                  </Text>
                </View>
                <View className="bg-card border border-muted rounded-2xl px-4 py-3.5 flex-row items-center">
                  <TextInput
                    className="flex-1 text-foreground text-base"
                    placeholder="25"
                    placeholderTextColor="rgb(105, 105, 105)"
                    value={age}
                    onChangeText={setAge}
                    keyboardType="number-pad"
                    editable={!loading}
                  />
                </View>
              </View>

              {/* Preview Card */}
              {(location || age) && (
                <View className="bg-primary/5 border border-primary/20 rounded-2xl p-4 mt-2">
                  <Text className="text-primary text-xs font-semibold uppercase tracking-wide mb-2">
                    Preview
                  </Text>
                  <View className="gap-1">
                    {location && (
                      <View className="flex-row items-center gap-2">
                        <Icon
                          name="map-marker-radius-outline"
                          size={14}
                          color="rgb(4, 116, 56)"
                        />
                        <Text className="text-foreground text-sm">
                          {location}
                        </Text>
                      </View>
                    )}
                    {age && (
                      <View className="flex-row items-center gap-2">
                        <Icon
                          name="calendar"
                          size={14}
                          color="rgb(4, 116, 56)"
                        />
                        <Text className="text-foreground text-sm">
                          {age} years old
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              )}
            </View>
          ) : (
            <View className="gap-4">
              {/* Selected Count */}
              {interests.length > 0 && (
                <View className="bg-primary/10 border border-primary/30 rounded-2xl p-4 flex-row items-center gap-3">
                  <Icon
                    name="check-circle-outline"
                    size={24}
                    color="rgb(4, 116, 56)"
                  />
                  <Text className="text-primary text-base font-semibold">
                    {interests.length}{" "}
                    {interests.length === 1 ? "interest" : "interests"} selected
                  </Text>
                </View>
              )}

              {/* Interest Grid */}
              <View className="flex-row flex-wrap gap-3">
                {INTEREST_OPTIONS.map((interest) => (
                  <TouchableOpacity
                    key={interest.name}
                    className={`rounded-2xl px-4 py-3 border-2 flex-row items-center gap-2 ${
                      interests.includes(interest.name)
                        ? "bg-primary border-primary"
                        : "bg-card border-muted"
                    }`}
                    onPress={() => toggleInterest(interest.name)}
                    disabled={loading}
                  >
                    <Icon
                      name={interest.icon}
                      size={18}
                      color={
                        interests.includes(interest.name)
                          ? "rgb(255, 255, 255)"
                          : "rgb(4, 116, 56)"
                      }
                    />
                    <Text
                      className={`text-sm font-semibold ${
                        interests.includes(interest.name)
                          ? "text-primary-foreground"
                          : "text-foreground"
                      }`}
                    >
                      {interest.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Buttons */}
        <View className="flex-row gap-3 mt-auto">
          <TouchableOpacity
            className="flex-1 rounded-2xl py-4 items-center bg-card border-2 border-muted"
            onPress={handleBack}
            disabled={loading}
          >
            <View className="flex-row items-center gap-2">
              <Icon name="chevron-left" size={20} color="rgb(105, 105, 105)" />
              <Text className="text-muted-foreground font-semibold text-base">
                Back
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            className={`flex-1 rounded-2xl py-4 items-center bg-primary ${
              loading ? "opacity-60" : ""
            }`}
            onPress={step === 1 ? handleContinue : handleComplete}
            disabled={loading}
            style={{
              shadowColor: "rgb(4, 116, 56)",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <View className="flex-row items-center gap-2">
                <Text className="text-primary-foreground font-bold text-base">
                  {step === 1 ? "Continue" : "Complete"}
                </Text>
                <Icon
                  name={step === 1 ? "chevron-right" : "check-bold"}
                  size={20}
                  color="rgb(255, 255, 255)"
                />
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};
