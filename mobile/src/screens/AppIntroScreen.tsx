import React, { useEffect, useRef } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Alert,
  Animated,
  Easing,
} from "react-native";
import { useRouter } from "expo-router";
import Icon from "@/components/ui/icon";
import { Checkbox } from "~/components/ui/checkbox";
import { cn } from "~/lib/utils";
import { Pressable } from "react-native";
import { TermsOfServiceSheet } from "~/components/ui/sheets/terms-of-service-sheet";
import { PrivacyPolicySheet } from "~/components/ui/sheets/privacy-policy-sheet";
import { Button } from "~/components/ui/button";

interface Feature {
  icon: "calendar" | "account-group" | "message-outline" | "star-outline";
  title: string;
  description: string;
}

const FEATURES: Feature[] = [
  {
    icon: "calendar",
    title: "Discover Events",
    description: "Find amazing events happening near you",
  },
  {
    icon: "account-group",
    title: "Meet People",
    description: "Connect with like-minded event enthusiasts",
  },
  {
    icon: "message-outline",
    title: "Chat & Collaborate",
    description: "Message other attendees and plan together",
  },
  {
    icon: "star-outline",
    title: "Personalized Matches",
    description: "Get event recommendations based on your interests",
  },
];

export const AppIntroScreen = () => {
  const router = useRouter();
  const [agreed, setAgreed] = React.useState(false);
  const [showTerms, setShowTerms] = React.useState(false);
  const [showPrivacy, setShowPrivacy] = React.useState(false);

  // One Animated.Value per card
  const fadeAnims = useRef(FEATURES.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    // Staggered animation: each card slides in from right with 300ms delay
    const animations = fadeAnims.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 600,
        delay: 400 + index * 300, // start after a tiny pause
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      })
    );

    Animated.stagger(300, animations).start();
  }, []);

  const handlePress = () => {
    if (!agreed) {
      Alert.alert("Terms Required", "Please agree to continue.", [
        { text: "OK" },
      ]);
      return;
    }
    router.push("/(auth)/sign-up");
  };

  const handleLogin = () => {
    if (!agreed) {
      Alert.alert("Terms Required", "Please agree to continue.", [
        { text: "OK" },
      ]);
      return;
    }
    router.push("/(auth)/sign-in");
  };

  return (
    <>
      <ScrollView
        className="flex-1 bg-background"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View className="px-6 pt-10">
          {/* Hero - Simple fade in */}
          <Animated.View
            style={{
              opacity: fadeAnims[0].interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
              }),
              transform: [
                {
                  translateY: fadeAnims[0].interpolate({
                    inputRange: [0, 1],
                    outputRange: [-50, 0],
                  }),
                },
              ],
            }}
            className="items-center mb-12"
          >
            <View className="bg-primary/20 w-24 h-24 rounded-3xl items-center justify-center mb-4">
              <Icon name="pulse" size={48} color="rgb(4, 116, 56)" />
            </View>
            <Text className="text-5xl font-black text-foreground text-center">
              EventMatch
            </Text>
            <Text className="text-lg text-muted-foreground text-center mt-3 px-6">
              Connect with amazing people at incredible events
            </Text>
          </Animated.View>

          {/* Features - Slide in from right with stagger */}
          <View className="gap-5 mb-8">
            {FEATURES.map((feature, index) => {
              const opacity = fadeAnims[index];
              const translateX = opacity.interpolate({
                inputRange: [0, 1],
                outputRange: [100, 0],
              });

              return (
                <Animated.View
                  key={index}
                  style={{
                    opacity,
                    transform: [{ translateX }],
                  }}
                  className="bg-card border border-muted rounded-2xl p-2 flex-row gap-5 items-start"
                >
                  <View className="bg-primary/20 w-14 h-14 rounded-2xl items-center justify-center">
                    <Icon
                      name={feature.icon}
                      size={28}
                      color="rgb(4, 116, 56)"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-xl font-bold text-foreground mb-1.5">
                      {feature.title}
                    </Text>
                    <Text className="text-base text-muted-foreground leading-6">
                      {feature.description}
                    </Text>
                  </View>
                </Animated.View>
              );
            })}
          </View>

          {/* Rest of your UI (unchanged) */}
          <View className="mb-10">
            <Checkbox
              id="terms"
              checked={agreed}
              onCheckedChange={setAgreed}
              label={
                <View className="flex-row items-center gap-1 ml-3">
                  <Text className="text-base text-foreground">
                    I agree to the{" "}
                  </Text>
                  <TouchableOpacity onPress={() => setShowTerms(true)}>
                    <Text className="text-base font-semibold text-primary underline">
                      Terms of Service
                    </Text>
                  </TouchableOpacity>
                  <Text className="text-base text-foreground"> and </Text>
                  <TouchableOpacity onPress={() => setShowPrivacy(true)}>
                    <Text className="text-base font-semibold text-primary underline">
                      Privacy Policy
                    </Text>
                  </TouchableOpacity>
                </View>
              }
            />
          </View>

          <View className="flex justify-between px-1 gap-4 pb-8">
            <Button
              text=" Get Started"
              onPress={handlePress}
              disabled={!agreed}
              className={`flex-1 mr-3 rounded-xl text-center`}
            />
            <Button
              variant="secondary"
              text="Already have an account?"
              onPress={handleLogin}
              disabled={!agreed}
              className={`flex-1 mr-3 rounded-xl text-center`}
            />
          </View>
        </View>
      </ScrollView>

      <TermsOfServiceSheet
        visible={showTerms}
        onClose={() => setShowTerms(false)}
      />
      <PrivacyPolicySheet
        visible={showPrivacy}
        onClose={() => setShowPrivacy(false)}
      />
    </>
  );
};
