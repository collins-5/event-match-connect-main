// src/components/ui/sheets/forgot-password-sheet.tsx
import React, { useState } from "react";
import { Text, View } from "react-native";
import Icon from "@/components/ui/icon";
import { supabase } from "@/lib/supabase";
import { BottomSheetModal } from "./filter-bottom-sheet";
import { Button } from "~/components/ui/button";
import { Input } from "@/components/ui/input";
import OTPInput from "@/components/ui/otp-input";

type Props = {
  visible: boolean;
  onClose: () => void;
};

type Step = "email" | "pin";

export const ForgotPasswordSheet = ({ visible, onClose }: Props) => {
  const [step, setStep] = useState<Step>("email");

  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Inline feedback
  const [emailError, setEmailError] = useState("");
  const [pinError, setPinError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const sendPin = async () => {
    setEmailError("");
    setSuccessMessage("");

    if (!email.trim()) {
      setEmailError("Please enter your email address");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
      });

      if (error) throw error;

      setStep("pin");
      setSuccessMessage("Check your email — we sent a 6-digit code");
    } catch (err: any) {
      setEmailError(err.message || "Failed to send code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const verifyPinAndUpdate = async () => {
    setPinError("");
    setPasswordError("");
    setSuccessMessage("");

    const cleanPin = pin.replace(/\D/g, "");
    if (cleanPin.length !== 6) {
      setPinError("Please enter a valid 6-digit code");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: cleanPin,
        type: "recovery",
      });
      if (verifyError) throw verifyError;

      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (updateError) throw updateError;

      setSuccessMessage("Password reset successfully!");
      setTimeout(() => onClose(), 1500);
    } catch (err: any) {
      setPinError(err.message || "Invalid or expired code");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail("");
    setPin("");
    setNewPassword("");
    setConfirmPassword("");
    setEmailError("");
    setPinError("");
    setPasswordError("");
    setSuccessMessage("");
    setStep("email");
    onClose();
  };

  return (
    <BottomSheetModal
      visible={visible}
      title="Reset Password"
      showDragHandle={true}
      showCloseButton={true}
      onClose={handleClose}
      heightMode="three-quarter"
    >
      <View className="px-6 pt-4 pb-10 gap-6">
        {/* STEP 1: Email */}
        {step === "email" && (
          <>
            <Text className="text-foreground/80 text-base text-center leading-6">
              We’ll send a 6-digit code to your email to reset your password.
            </Text>

            <View>
              <Input
                label="Email Address"
                placeholder="you@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoFocus
                editable={!loading}
                error={emailError}
                iconProps={{ name: "email-outline", color: "#696969" }}
              />

              {successMessage && (
                <View className="mt-4 px-4 py-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                  <Text className="text-emerald-700 text-center font-medium">
                    {successMessage}
                  </Text>
                </View>
              )}
            </View>

            <View className="gap-3">
              <Button
                text="Send Code"
                onPress={sendPin}
                size="lg"
                width="full"
                loading={loading}
              />
              <Button
                variant="outline"
                text="Cancel"
                onPress={handleClose}
                size="lg"
                width="full"
              />
            </View>
          </>
        )}

        {/* STEP 2: PIN + New Password */}
        {step === "pin" && (
          <>
            <View className="items-center gap-4">
              <Text className="text-xl font-bold text-foreground text-center">
                Enter 6-Digit Code
              </Text>
              <Text className="text-muted-foreground text-center text-sm px-8">
                We sent a code to{"\n"}
                <Text className="font-semibold text-foreground">{email}</Text>
              </Text>
            </View>

            <View>
              <OTPInput length={6} value={pin} onChange={setPin} />
              {pinError && (
                <Text className="mt-2 text-sm text-destructive text-center">
                  {pinError}
                </Text>
              )}
            </View>

            <View className="gap-5">
              <Input
                label="New Password"
                placeholder="Enter new password"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
                editable={!loading}
                iconProps={{ name: "lock-outline", color: "#696969" }}
              />

              <Input
                label="Confirm Password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                editable={!loading}
                error={
                  passwordError ||
                  (newPassword &&
                  confirmPassword &&
                  newPassword !== confirmPassword
                    ? "Passwords do not match"
                    : undefined)
                }
                iconProps={{ name: "lock-check-outline", color: "#696969" }}
              />
            </View>

            {successMessage && (
              <View className="px-4 py-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                <Text className="text-emerald-700 text-center font-medium">
                  {successMessage}
                </Text>
              </View>
            )}

            <View className="gap-3">
              <Button
                text="Reset Password"
                onPress={verifyPinAndUpdate}
                size="lg"
                width="full"
                loading={loading}
              />
              <Button
                variant="outline"
                text="Wrong email? Go back"
                onPress={() => {
                  setStep("email");
                  setPin("");
                  setPinError("");
                  setPasswordError("");
                }}
                size="lg"
                width="full"
              />
            </View>
          </>
        )}
      </View>
    </BottomSheetModal>
  );
};
