// components/HomeHeader.tsx
import { View, Text } from "react-native";
import { Image } from "expo-image";
import { memo } from "react";
import { cn } from "@/lib/utils";
import { Pressable } from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Skeleton } from "../ui/skeleton";
import { TouchableOpacity } from "react-native";

type HomeHeaderProps = {
  userName?: string | null;
  initials: string;
  avatarUrl?: string | null;
  className?: string;
  loading?: boolean;
  SettingsOpen?: () => void;
  settingsOpen?: boolean;
};

const HomeHeaderComponent = ({
  userName,
  initials,
  avatarUrl,
  className,
  loading,
  SettingsOpen,
}: HomeHeaderProps) => {
  const firstName = userName?.split(" ")[0] || "there";

  return (
    <TouchableOpacity
      onPress={SettingsOpen}
      className={cn(
        "flex-row items-center justify-between py-1 px-4",
        className
      )}
    >
      <View className="flex-1">
        <View className="flex-row items-center gap-2">
          {loading ? (
            <Skeleton className="w-16 h-16 rounded-full overflow-hidden border-3 border-card bg-card shadow-lg items-center justify-center" />
          ) : (
            <View
              className="w-14 h-14 rounded-full overflow-hidden border-3 border-card bg-card shadow-lg items-center justify-center"
            >
              {avatarUrl ? (
                <Image
                  source={{ uri: avatarUrl }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              ) : (
                <Text className="text-primary text-xl font-bold">
                  {initials}
                </Text>
              )}
            </View>
          )}
          <View className="relative ml-5">
            <Text className="text-4xl">Sparkles</Text>
            <View className="absolute -inset-2 blur-3xl opacity-70">
              <Text className="text-4xl text-primary-foreground">Sparkles</Text>
            </View>
          </View>

          <Text className="text-4xl font-black text-foreground tracking-tighter">
            EventMatch
          </Text>
        </View>

        {/* Greeting */}
        {userName ? (
          <Text className="text-base text-primary-foreground mt-1">
            Hey,{" "}
            <Text className="font-bold text-primary-foreground">
              {firstName}
            </Text>
            <Text className="text-muted"> Wave</Text>
          </Text>
        ) : (
          <Text className="text-base text-muted-foreground mt-1">
            Discover events that match your vibe
          </Text>
        )}
      </View>

      {/* Right: Avatar with subtle glow */}
      <View className="relative ml-4">
        {/* Soft glow ring */}
        <View className="absolute -inset-1 blur-xl opacity-50">
          <View className="w-full h-full rounded-full bg-primary" />
        </View>

        {/* Avatar */}
        {/* {loading ? (
          <Skeleton className="w-16 h-16 rounded-full overflow-hidden border-3 border-card bg-card shadow-lg items-center justify-center" />
        ) : (
          <Pressable
            onPress={() => {
              router.push("/profile");
            }}
            className="w-14 h-14 rounded-full overflow-hidden border-3 border-card bg-card shadow-lg items-center justify-center"
          >
            {avatarUrl ? (
              <Image
                source={{ uri: avatarUrl }}
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              <Text className="text-primary text-xl font-bold">{initials}</Text>
            )}
          </Pressable>
        )} */}

        {/* Tiny online dot */}
        {/* <View className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-green-500 border-2 border-card" /> */}
      </View>
    </TouchableOpacity>
  );
};

export const HomeHeader = memo(HomeHeaderComponent);
