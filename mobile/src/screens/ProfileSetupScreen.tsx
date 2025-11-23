import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";

import { Screen } from "@/components/Screen";
import { supabase } from "@/lib/supabase";

const INTEREST_OPTIONS = [
  "Music",
  "Sports",
  "Art",
  "Food",
  "Technology",
  "Gaming",
  "Fitness",
  "Travel",
  "Photography",
  "Reading",
  "Movies",
  "Dancing",
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
      alert("Please fill in all fields");
      return;
    }

    setStep(2);
  };

  const handleComplete = async () => {
    if (interests.length === 0) {
      alert("Please select at least one interest");
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
      alert("Profile setup complete!");

      // Navigate to home - the session provider will handle auth check
      router.replace("/(tabs)/home");
    } catch (error: any) {
      console.error("❌ Profile setup error:", error);
      alert("Failed to save profile: " + (error.message || "Unknown error"));
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
    <Screen>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress */}
        <View style={styles.progressContainer}>
          <Text style={styles.stepLabel}>Step {step} of 2</Text>
          <View style={styles.progressBars}>
            <View
              style={[
                styles.progressBar,
                step >= 1 && styles.progressBarActive,
              ]}
            />
            <View
              style={[
                styles.progressBar,
                step >= 2 && styles.progressBarActive,
              ]}
            />
          </View>
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>
            {step === 1
              ? "Tell us about yourself"
              : "What are you interested in?"}
          </Text>
          <Text style={styles.subtitle}>
            {step === 1
              ? "Help us personalize your experience"
              : "Select your interests to find matching events"}
          </Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {step === 1 ? (
            <>
              <View>
                <Text style={styles.label}>Location</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., San Francisco, CA"
                  placeholderTextColor="rgba(255,255,255,0.4)"
                  value={location}
                  onChangeText={setLocation}
                  editable={!loading}
                />
              </View>

              <View>
                <Text style={styles.label}>Age</Text>
                <TextInput
                  style={styles.input}
                  placeholder="25"
                  placeholderTextColor="rgba(255,255,255,0.4)"
                  value={age}
                  onChangeText={setAge}
                  keyboardType="number-pad"
                  editable={!loading}
                />
              </View>
            </>
          ) : (
            <View style={styles.interestsGrid}>
              {INTEREST_OPTIONS.map((interest) => (
                <TouchableOpacity
                  key={interest}
                  style={[
                    styles.interestTag,
                    interests.includes(interest) && styles.interestTagActive,
                  ]}
                  onPress={() => toggleInterest(interest)}
                  disabled={loading}
                >
                  <Text
                    style={[
                      styles.interestTagText,
                      interests.includes(interest) &&
                        styles.interestTagTextActive,
                    ]}
                  >
                    {interest}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={handleBack}
            disabled={loading}
          >
            <Text style={styles.secondaryButtonText}>
              {step === 1 ? "Back" : "Back"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              styles.primaryButton,
              loading && styles.buttonDisabled,
            ]}
            onPress={step === 1 ? handleContinue : handleComplete}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.primaryButtonText}>
                {step === 1 ? "Continue" : "Complete Setup"}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  progressContainer: {
    marginTop: 16,
    marginBottom: 24,
  },
  stepLabel: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
    marginBottom: 8,
  },
  progressBars: {
    flexDirection: "row",
    gap: 8,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 2,
  },
  progressBarActive: {
    backgroundColor: "#7c3aed",
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "white",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.6)",
    lineHeight: 20,
  },
  content: {
    marginBottom: 40,
    flex: 1,
  },
  label: {
    color: "rgba(255,255,255,0.9)",
    fontWeight: "600",
    marginBottom: 8,
    fontSize: 14,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: "white",
    fontSize: 16,
    marginBottom: 20,
  },
  interestsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  interestTag: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  interestTagActive: {
    backgroundColor: "#7c3aed",
    borderColor: "#7c3aed",
  },
  interestTagText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    fontWeight: "500",
  },
  interestTagTextActive: {
    color: "white",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: "auto",
  },
  button: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: "#7c3aed",
  },
  primaryButtonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  secondaryButtonText: {
    color: "rgba(255,255,255,0.7)",
    fontWeight: "600",
    fontSize: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
