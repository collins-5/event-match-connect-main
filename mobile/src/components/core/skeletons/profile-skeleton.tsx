// src/components/skeletons/ProfileScreenSkeleton.tsx
import { View, ScrollView } from "react-native";
import { Skeleton } from "@/components/ui/skeleton";

export const ProfileScreenSkeleton = () => {
  return (
    <ScrollView
      className="flex-1 bg-background"
      showsVerticalScrollIndicator={false}
    >
      <View className="px-6 pt-6 pb-10">
        {/* Header with Avatar */}
        <View className="items-center mb-6">
          <View className="relative mb-4">
            {/* Avatar Skeleton */}
            <Skeleton className="w-24 h-24 rounded-full" />
            {/* Edit Button Skeleton */}
            <Skeleton className="absolute bottom-0 right-0 w-8 h-8 rounded-full" />
          </View>

          {/* Name Skeleton */}
          <Skeleton className="h-7 w-40 mb-2" />
          {/* Email Skeleton */}
          <Skeleton className="h-4 w-48" />
        </View>

        {/* Tabs Skeleton */}
        <View className="bg-muted rounded-full p-1 mb-6">
          <View className="flex-row gap-2">
            <Skeleton className="flex-1 h-10 rounded-full" />
            <Skeleton className="flex-1 h-10 rounded-full" />
          </View>
        </View>

        {/* Stats Cards Skeleton */}
        <View className="flex-row gap-3 mb-6">
          <View className="flex-1 bg-card border border-muted rounded-2xl p-4 items-center gap-2">
            <Skeleton className="w-8 h-8 rounded-lg" />
            <Skeleton className="h-8 w-12" />
            <Skeleton className="h-3 w-20" />
          </View>
          <View className="flex-1 bg-card border border-muted rounded-2xl p-4 items-center gap-2">
            <Skeleton className="w-8 h-8 rounded-lg" />
            <Skeleton className="h-8 w-12" />
            <Skeleton className="h-3 w-16" />
          </View>
        </View>

        {/* Bio Card Skeleton */}
        <View className="bg-card border border-muted rounded-2xl p-5 mb-4">
          <View className="flex-row items-center gap-2 mb-3">
            <Skeleton className="w-5 h-5 rounded" />
            <Skeleton className="h-3 w-20" />
          </View>
          <View className="gap-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </View>
        </View>

        {/* Info Cards Skeleton */}
        <View className="gap-3 mb-4">
          {/* Location Card */}
          <View className="bg-card border border-muted rounded-2xl p-4">
            <View className="flex-row items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-xl" />
              <View className="flex-1 gap-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-5 w-32" />
              </View>
            </View>
          </View>

          {/* Age Card */}
          <View className="bg-card border border-muted rounded-2xl p-4">
            <View className="flex-row items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-xl" />
              <View className="flex-1 gap-2">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-5 w-24" />
              </View>
            </View>
          </View>
        </View>

        {/* Interests Card Skeleton */}
        <View className="bg-card border border-muted rounded-2xl p-5 mb-4">
          <View className="flex-row items-center gap-2 mb-3">
            <Skeleton className="w-5 h-5 rounded" />
            <Skeleton className="h-3 w-16" />
          </View>
          <View className="flex-row flex-wrap gap-2">
            <Skeleton className="h-8 w-20 rounded-full" />
            <Skeleton className="h-8 w-24 rounded-full" />
            <Skeleton className="h-8 w-16 rounded-full" />
            <Skeleton className="h-8 w-28 rounded-full" />
            <Skeleton className="h-8 w-20 rounded-full" />
          </View>
        </View>

        {/* Sign Out Button Skeleton */}
        <Skeleton className="h-14 w-full rounded-2xl" />
      </View>
    </ScrollView>
  );
};
