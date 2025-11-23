import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";

import { Screen } from "@/components/Screen";

interface Feature {
  icon: string;
  title: string;
  description: string;
}

const FEATURES: Feature[] = [
  {
    icon: "🎉",
    title: "Discover Events",
    description: "Find amazing events happening near you",
  },
  {
    icon: "🤝",
    title: "Meet People",
    description: "Connect with like-minded event enthusiasts",
  },
  {
    icon: "💬",
    title: "Chat & Collaborate",
    description: "Message other attendees and plan together",
  },
  {
    icon: "⭐",
    title: "Personalized Matches",
    description: "Get event recommendations based on your interests",
  },
];

export const AppIntroScreen = () => {
  const router = useRouter();

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.hero}>
          <Text style={styles.heroEmoji}>🎊</Text>
          <Text style={styles.heroTitle}>EventMatch</Text>
          <Text style={styles.heroSubtitle}>
            Connect with amazing people at incredible events
          </Text>
        </View>

        {/* Features Grid */}
        <View style={styles.featuresContainer}>
          {FEATURES.map((feature, index) => (
            <View key={index} style={styles.featureCard}>
              <Text style={styles.featureIcon}>{feature.icon}</Text>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>
                {feature.description}
              </Text>
            </View>
          ))}
        </View>

        {/* CTA Buttons */}
        <View style={styles.ctaContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push("/(auth)/sign-in")}
          >
            <Text style={styles.primaryButtonText}>Get Started</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push("/(auth)/sign-in")}
          >
            <Text style={styles.secondaryButtonText}>
              Already have an account?
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  hero: {
    alignItems: "center",
    gap: 12,
    marginTop: 60,
    marginBottom: 40,
  },
  heroEmoji: {
    fontSize: 64,
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: 40,
    fontWeight: "800",
    color: "white",
    textAlign: "center",
  },
  heroSubtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
    marginHorizontal: 20,
    lineHeight: 24,
  },
  featuresContainer: {
    gap: 12,
    marginHorizontal: 8,
    marginBottom: 40,
  },
  featureCard: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  featureIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "white",
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: "rgba(255,255,255,0.6)",
    lineHeight: 20,
  },
  ctaContainer: {
    gap: 12,
    marginHorizontal: 20,
    marginTop: "auto",
  },
  primaryButton: {
    backgroundColor: "#7c3aed",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  secondaryButtonText: {
    color: "rgba(255,255,255,0.7)",
    fontWeight: "600",
    fontSize: 16,
  },
});
