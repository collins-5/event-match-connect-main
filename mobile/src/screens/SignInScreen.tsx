// src/app/(auth)/sign-in.tsx
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
  View,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";

import Icon from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Button } from "~/components/ui/button";
import { Text } from "@/components/ui/text";
import { supabase } from "@/lib/supabase";
import { ForgotPasswordSheet } from "~/components/ui/sheets/forgot-password-sheet";
import { Separator } from "~/components/ui/separator";

export default function SignInScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleloading, setGoogleloading] = useState(false);
  const [error, setError] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleSignIn = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) throw error;
      // Success → auth listener in _layout.tsx will redirect to (app)
    } catch (err: any) {
      setError(err.message || "Sign in failed");
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
    <>
      <SafeAreaView className="flex-1 bg-background">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View className="flex-1 justify-start px-6 pt-12">
              {/* Logo & Welcome */}
              <View className="items-center mb-10">
                <View className="bg-primary/20 w-24 h-24 rounded-3xl items-center justify-center mb-6">
                  <Icon name="pulse" size={52} color="rgb(4, 116, 56)" />
                </View>
                <Text className="text-4xl font-black text-foreground">
                  Welcome Back
                </Text>
                <Text className="text-muted-foreground text-base text-center mt-3 px-8">
                  Sign in to continue matching at events
                </Text>
              </View>

              {/* Global Error */}
              <View className="rounded-2xl px-4 h-4 mb-2">
                {error ? (
                  <Text className="text-destructive text-center text-sm font-medium">
                    {error}
                  </Text>
                ) : null}
              </View>

              {/* Form */}
              <View className="gap-5">
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

                {/* Forgot Password Link */}
                <TouchableOpacity
                  onPress={() => setShowForgotPassword(true)}
                  className="self-end -mt-3 mb-2"
                >
                  <Text className="text-primary text-sm font-medium">
                    Forgot Password?
                  </Text>
                </TouchableOpacity>

                <View className="mt-2">
                  <Button
                    text="Sign In"
                    onPress={handleSignIn}
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

              {/* Sign Up Link */}
              <View className="flex-row justify-center mt-12">
                <Text className="text-muted-foreground text-base">
                  New here?{" "}
                </Text>
                <TouchableOpacity
                  onPress={() => router.replace("/(auth)/sign-up")}
                >
                  <Text className="text-primary font-bold text-base">
                    Create an account
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>

      <ForgotPasswordSheet
        visible={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      />
    </>
  );
}
