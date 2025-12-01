// app/(auth)/account-settings.tsx
import React from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import HeaderSafeAreaView from "~/components/core/header-safe-area-view";
import { Separator } from "~/components/ui/separator";
import { ForgotPasswordSheet } from "~/components/ui/sheets/forgot-password-sheet";
import { DeleteAccountSheet } from "~/components/ui/sheets/delete-account-sheet";
import { useProfile } from "~/hooks/useProfile";
import { useSession } from "~/hooks/useSession";
import { Alert } from "react-native";
import { Skeleton } from "~/components/ui/skeleton";
import ProfileAccountSettingsSkeleton from "~/components/core/skeletons/profile-account-settings-skeleton";

export default function AccountSettings() {
  const router = useRouter();
  const { user } = useSession();
  const { profile, loading: profileLoading } = useProfile();

  const [showForgotPassword, setShowForgotPassword] = React.useState(false);
  const [deleteSheetVisible, setDeleteSheetVisible] = React.useState(false);

  const handleEditProfile = () => {
    router.push("/(auth)/profile-edit");
  };

  const handleDeletePress = () => {
    setDeleteSheetVisible(true);
  };

  const handleConfirmDelete = () => {
    Alert.alert("Deleted", "Your account has been permanently deleted.");
    setDeleteSheetVisible(false);
  };

  // if (profileLoading) {
  //   return (
  //     <>
  //       <HeaderSafeAreaView />
  //       <View className="flex-1 bg-background justify-center items-center">
  //         <Text className="text-muted-foreground">Loading profile...</Text>
  //       </View>
  //     </>
  //   );
  // }

  return (
    <>
      <HeaderSafeAreaView />

      {/* Your exact header */}
      <View className="flex-row items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <Button
          variant="primary"
          size="icon"
          onPress={() => router.back()}
          className="mr-3"
          leftIcon={
            <Icon name="arrow-left" size={24} className="text-primary" />
          }
        />
        <Text className="text-2xl font-bold text-foreground">
          Account Settings
        </Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {/* Profile Information */}
          {profileLoading ? (
           <ProfileAccountSettingsSkeleton/>
          ) : (
            <View className="px-6 py-6">
              <Text className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-5">
                Profile Information
              </Text>

              {/* Full Name */}
              <View className="flex-row items-center bg-muted/30 rounded-xl px-4 py-4 mb-4">
                <Icon
                  name="account-outline"
                  size={22}
                  className="text-primary mr-3"
                />
                <View className="flex-1">
                  <Text className="text-sm text-muted-foreground">
                    Full Name
                  </Text>
                  <Text className="text-base text-foreground font-medium">
                    {profile?.full_name || "Not set"}
                  </Text>
                </View>
              </View>

              {/* Email — from auth.user (always available) */}
              <View className="flex-row items-center bg-muted/30 rounded-xl px-4 py-4 mb-4">
                <Icon
                  name="email-outline"
                  size={22}
                  className="text-primary mr-3"
                />
                <View className="flex-1">
                  <Text className="text-sm text-muted-foreground">
                    Email Address
                  </Text>
                  <Text className="text-base text-foreground font-medium">
                    {user?.email || "Not set"}
                  </Text>
                </View>
              </View>

              {/* Phone — safely from profile */}
              <View className="flex-row items-center bg-muted/30 rounded-xl px-4 py-4 mb-6">
                <Icon
                  name="phone-outline"
                  size={22}
                  className="text-primary mr-3"
                />
                <View className="flex-1">
                  <Text className="text-sm text-muted-foreground">
                    Phone Number
                  </Text>
                  <Text className="text-base text-foreground font-medium">
                    {(profile as any)?.phone || "Not set"}
                  </Text>
                </View>
              </View>
              <View className="absolute right-0">
                <Button
                  text="edit"
                  variant="ghost"
                  className="text-primary"
                  leftIcon={
                    <Icon
                      name={"account-edit"}
                      className="text-primary"
                      size={28}
                    />
                  }
                  onPress={handleEditProfile}
                  size="lg"
                />
              </View>
            </View>
          )}

          {/* Security */}
          <View className="px-6 py-6 border-t border-gray-200 dark:border-gray-700">
            <Text className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">
              Security
            </Text>
            <Separator className="my-1 bg-muted" />

            <Button
              variant="ghost"
              className="justify-between"
              onPress={() => setShowForgotPassword(true)}
              leftIcon={
                <Icon name="lock-outline" size={22} className="text-primary" />
              }
              rightIcon={
                <Icon
                  name="chevron-right"
                  size={22}
                  className="text-muted-foreground"
                />
              }
              text="Change Password"
            />
            <Separator className="my-1 bg-muted" />

            <Button
              variant="ghost"
              className="justify-between"
              leftIcon={
                <Icon
                  name="shield-check-outline"
                  size={22}
                  className="text-primary"
                />
              }
              rightIcon={
                <Icon
                  name="chevron-right"
                  size={22}
                  className="text-muted-foreground"
                />
              }
              text="Two-Factor Authentication"
            />
            <Separator className="my-1 bg-muted" />

            <Button
              variant="ghost"
              className="justify-between"
              leftIcon={
                <Icon name="devices" size={22} className="text-primary" />
              }
              rightIcon={
                <Icon
                  name="chevron-right"
                  size={22}
                  className="text-muted-foreground"
                />
              }
              text="Manage Sessions"
            />
            <Separator className="my-1 bg-muted" />
          </View>

          {/* Danger Zone */}
          <View className="px-6 py-6 border-t border-gray-200 dark:border-gray-700">
            <Text className="text-sm font-semibold text-red-600 uppercase tracking-wider mb-5">
              Danger Zone
            </Text>
            <Button
              variant="destructive"
              text="Delete Account"
              onPress={handleDeletePress}
              leftIcon={<Icon name="delete-outline" size={22} />}
              textClassName="text-red-600 font-semibold"
            />
          </View>

          <View className="h-20" />
        </ScrollView>
      </KeyboardAvoidingView>

      <ForgotPasswordSheet
        visible={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      />

      <DeleteAccountSheet
        visible={deleteSheetVisible}
        onClose={() => setDeleteSheetVisible(false)}
        onConfirmDelete={handleConfirmDelete}
        isDeleting={false}
      />
    </>
  );
}
