import { useState } from "react";
import {
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import Icon from "@/components/ui/icon";

import { supabase } from "@/lib/supabase";

export const AuthScreen = () => {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleAuth = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (isSignUp && !fullName.trim()) {
      Alert.alert("Error", "Please enter your full name");
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        console.log("🔐 Signing up with:", email);
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password: password.trim(),
          options: {
            data: {
              full_name: fullName.trim(),
            },
          },
        });
        if (error) throw error;
        router.push("/(auth)/profile-setup");
      } else {
        console.log("🔐 Signing in with:", email);
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password.trim(),
        });
        if (error) throw error;
      }
    } catch (error: any) {
      console.error("❌ Auth error:", error);
      setError(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-background"
    >
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View className="flex-1 px-6 py-10">
          {/* Header */}
          <View className="items-center gap-3 mt-10 mb-10">
            <View className="bg-primary/20 w-20 h-20 rounded-3xl items-center justify-center mb-2">
            <Icon name="pulse" size={40} color="rgb(4, 116, 56)" />
            </View>
            <Text className="text-3xl font-black text-foreground">
              EventMatch
            </Text>
            <Text className="text-muted-foreground text-sm text-center px-5">
              {isSignUp
                ? "Create an account to get started"
                : "Welcome back! Sign in to your account"}
            </Text>
          </View>

          {/* Form */}
          <View><Text className='text-destructive'>{error}</Text></View>
          <View className="gap-4">
            {isSignUp && (
              <View>
                <View className="flex-row items-center gap-2 mb-2">
                  <Icon
                    name="account-outline"
                    size={16}
                    color="rgb(105, 105, 105)"
                  />
                  <Text className="text-muted-foreground font-semibold text-sm">
                    Full Name
                  </Text>
                </View>
                <View className="bg-card border border-muted rounded-2xl px-4 py-3.5 flex-row items-center">
                  <TextInput
                    className="flex-1 text-foreground text-base"
                    placeholder="John Doe"
                    placeholderTextColor="rgb(105, 105, 105)"
                    value={fullName}
                    onChangeText={setFullName}
                    editable={!loading}
                  />
                </View>
              </View>
            )}

            <View>
              <View className="flex-row items-center gap-2 mb-2">
                <Icon
                  name="email-outline"
                  size={16}
                  color="rgb(105, 105, 105)"
                />
                <Text className="text-muted-foreground font-semibold text-sm">
                  Email
                </Text>
              </View>
              <View className="bg-card border border-muted rounded-2xl px-4 py-3.5 flex-row items-center">
                <TextInput
                  className="flex-1 text-foreground text-base"
                  placeholder="you@example.com"
                  placeholderTextColor="rgb(105, 105, 105)"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!loading}
                />
              </View>
            </View>

            <View>
              <View className="flex-row items-center gap-2 mb-2">
                <Icon
                  name="lock-outline"
                  size={16}
                  color="rgb(105, 105, 105)"
                />
                <Text className="text-muted-foreground font-semibold text-sm">
                  Password
                </Text>
              </View>
              <View className="bg-card border border-muted rounded-2xl px-4 py-3.5 flex-row items-center">
                <TextInput
                  className="flex-1 text-foreground text-base"
                  placeholder="••••••••"
                  placeholderTextColor="rgb(105, 105, 105)"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  editable={!loading}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  className="ml-2"
                >
                  <Icon
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color="rgb(105, 105, 105)"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              className={`bg-primary rounded-2xl py-4 items-center mt-4 ${
                loading ? "opacity-60" : ""
              }`}
              onPress={handleAuth}
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
                <Text className="text-primary-foreground font-bold text-base">
                  {isSignUp ? "Sign Up" : "Sign In"}
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Toggle Auth Mode */}
          <View className="flex-row justify-center items-center mt-auto mb-5">
            <Text className="text-muted-foreground text-sm">
              {isSignUp
                ? "Already have an account? "
                : "Don't have an account? "}
            </Text>
            <TouchableOpacity
              onPress={() => setIsSignUp(!isSignUp)}
              disabled={loading}
            >
              <Text className="text-primary font-bold text-sm">
                {isSignUp ? "Sign In" : "Sign Up"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
