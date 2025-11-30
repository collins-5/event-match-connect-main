// src/app/(auth)/sign-up.tsx
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
  View,
} from "react-native";
import { useRouter } from "expo-router";

import Icon from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Button } from "~/components/ui/button";
import { Text } from "@/components/ui/text";
import { supabase } from "@/lib/supabase";
import { TouchableOpacity } from "react-native";
import { Separator } from "~/components/ui/separator";

export default function SignUpScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [googleloading, setGoogleloading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignUp = async () => {
    // Client-side validation
    if (
      !fullName.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password.trim(),
        options: {
          data: { full_name: fullName.trim() },
        },
      });

      if (error) throw error;

      router.replace("/(auth)/profile-setup");
    } catch (err: any) {
      setError(err.message || "Sign up failed");
    } finally {
      setLoading(false);
    }
  };
  const handleSignInWithGoogle = async () => {
    setError("");
    setGoogleloading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: supabase.auth.getUrl().toString(),
        },
      });

      if (error) throw error;
      // Success → auth listener in _layout.tsx will redirect to (app)
    } catch (err: any) {
      setError("Google sign-in will be implemented soon.");
    } finally {
      setGoogleloading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1 justify-start px-6 pt-12">
            {/* Logo & Title – Moved higher */}
            <View className="items-center mb-10">
              <View className="bg-primary/20 w-24 h-24 rounded-3xl items-center justify-center mb-6">
                <Icon name="pulse" size={52} color="rgb(4, 116, 56)" />
              </View>
              <Text className="text-4xl font-black text-foreground">
                EventMatch
              </Text>
              <Text className="text-muted-foreground text-base text-center mt-3 px-8">
                Let's get you set up and ready to match at events
              </Text>
            </View>

            {/* Global Error */}
            {error ? (
              <View className="rounded-2xl px-4 py-3 mb-2">
                <Text className="text-destructive text-center text-sm font-medium">
                  {error}
                </Text>
              </View>
            ) : null}

            {/* Form – Now starts higher on screen */}
            <View className="gap-5">
              <Input
                label="Full Name"
                placeholder="John Doe"
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
                editable={!loading}
                iconProps={{ name: "account-outline", color: "#696969" }}
              />

              <Input
                label="Email"
                placeholder="you@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
                iconProps={{ name: "email-outline", color: "#696969" }}
              />

              <Input
                label="Password"
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!loading}
                iconProps={{ name: "lock-outline", color: "#696969" }}
              />

              <Input
                label="Confirm Password"
                placeholder="••••••••"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                editable={!loading}
                error={
                  password && confirmPassword && password !== confirmPassword
                    ? "Passwords don't match"
                    : undefined
                }
                iconProps={{ name: "lock-check-outline", color: "#696969" }} // optional nicer icon
              />

              <View className="mt-4">
                <Button
                  text="Create Account"
                  onPress={handleSignUp}
                  size="lg"
                  width="full"
                  loading={loading}
                />
                <Separator text={"OR"} className="bg-muted" />

                <Button
                  variant="outline"
                  text="Sign In With Google"
                  onPress={handleSignInWithGoogle}
                  size="lg"
                  width="full"
                  loading={googleloading}
                />
              </View>
            </View>

            {/* Sign In Link */}
            <View className="flex-row justify-center mt-12">
              <Text className="text-muted-foreground text-base">
                Already have an account?{" "}
              </Text>
              <TouchableOpacity
                onPress={() => router.replace("/(auth)/sign-in")}
              >
                <Text className="text-primary font-bold text-base">
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
