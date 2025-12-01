// app/(tabs)/profile/edit.tsx
import React from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useProfileEdit } from "~/hooks/useProfileEdit";
import ProfileEditScreenSkeleton from "~/components/core/skeletons/profile-edit-screen-skeleton";
const INTEREST_OPTIONS = [
  { name: "Music", icon: "microphone" },
  { name: "Sports", icon: "arm-flex" },
  { name: "Art", icon: "image" },
  { name: "Food", icon: "food-apple" },
  { name: "Technology", icon: "access-point" },
  { name: "Gaming", icon: "view-module" },
  { name: "Fitness", icon: "arm-flex" },
  { name: "Travel", icon: "earth" },
  { name: "Photography", icon: "camera" },
  { name: "Reading", icon: "clipboard-text" },
  { name: "Movies", icon: "video-outline" },
  { name: "Dancing", icon: "account-group" },
];

export default function ProfileEditScreen() {
  const router = useRouter();
  const {
    loading,
    saving,
    formData,
    setFormData,
    pickImage,
    toggleInterest,
    saveProfile,
  } = useProfileEdit();

  if (loading) {
    return (
      <ProfileEditScreenSkeleton/>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-background"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <View className="px-6 py-8">
        {/* Avatar */}
        <View className="items-center mb-10">
          <TouchableOpacity onPress={pickImage} disabled={saving}>
            <View className="relative">
              {formData.avatarUrl ? (
                <Image
                  source={{ uri: formData.avatarUrl }}
                  className="w-32 h-32 rounded-full"
                  cachePolicy="memory-disk"
                />
              ) : (
                <View className="w-32 h-32 rounded-full bg-primary justify-center items-center">
                  <Icon name="account" size={28} className='text-primary-forground' />
                </View>
              )}
              <View className="absolute bottom-0 right-0 bg-primary rounded-full p-3.5">
                <Icon name="pencil" size={22} color="white" />
              </View>
            </View>
          </TouchableOpacity>
          <Text className="text-muted-foreground text-sm mt-4">
            Tap to change photo
          </Text>
        </View>

        {/* Form Fields */}
        <View className="gap-6">
          <Input
            label="Full Name"
            value={formData.fullName}
            onChangeText={(text: string) =>
              setFormData((prev) => ({ ...prev, fullName: text }))
            }
            placeholder="John Doe"
            iconProps={{ name: "account-outline" }}
          />

          <Input
            label="Bio"
            value={formData.bio}
            onChangeText={(text: string) =>
              setFormData((prev) => ({ ...prev, bio: text }))
            }
            placeholder="Tell us about yourself..."
            multiline
            className="h-32 py-3"
            textAlignVertical="top"
            iconProps={{ name: "text" }}
          />

          <View className="flex-row gap-4">
            <View className="w-1/2">
              <Input
                label="Location"
                value={formData.location}
                onChangeText={(text: string) =>
                  setFormData((prev) => ({ ...prev, location: text }))
                }
                placeholder="Nairobi, Kenya"
                className="flex-1"
                iconProps={{ name: "map-marker-radius-outline" }}
              />
            </View>
            <View className="w-1/2">
                <Input
                  label="Age"
                  value={formData.age}
                  onChangeText={(text: string) =>
                    setFormData((prev) => ({
                      ...prev,
                      age: text.replace(/[^0-9]/g, ""),
                    }))
                  }
                  placeholder="25"
                  keyboardType="number-pad"
                  className="flex-1 "
                  iconProps={{ name: "calendar" }}
                />
            </View>
          </View>

          {/* Interests */}
          <View>
            <Text className="text-muted-foreground text-sm font-semibold mb-4">
              Interests
            </Text>
            <View className="flex-row flex-wrap gap-3">
              {INTEREST_OPTIONS.map((item) => {
                const isSelected = formData.interests.includes(item.name);
                return (
                  <TouchableOpacity
                    key={item.name}
                    onPress={() => toggleInterest(item.name)}
                    className={`
                      rounded-2xl px-5 py-3.5 flex-row items-center gap-2.5 border-2
                      ${
                        isSelected
                          ? "bg-primary border-primary"
                          : "bg-card border-muted"
                      }
                    `}
                  >
                    <Icon
                      name={item.icon as any}
                      size={20}
                      color={isSelected ? "white" : "rgb(4, 116, 56)"}
                    />
                    <Text
                      className={`
                        font-semibold text-sm
                        ${isSelected ? "text-white" : "text-foreground"}
                      `}
                    >
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        <View className="flex-row gap-4 mt-10">
          <Button
            text="Cancel"
            variant="outline"
            onPress={() => router.back()}
            disabled={saving}
            className="flex-1 text-center"
          />
          <Button
            text={saving ? "Saving..." : "Save Changes"}
            onPress={saveProfile}
            disabled={saving}
            loading={saving}
            className="flex-1 text-center"
          />
        </View>
      </View>
    </ScrollView>
  );
}
