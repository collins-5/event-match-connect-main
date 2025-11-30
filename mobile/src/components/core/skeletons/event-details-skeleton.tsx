// src/components/skeletons/EventDetailSkeleton.tsx
import { View, Dimensions } from "react-native";
import { Skeleton } from "@/components/ui/skeleton";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const EventDetailSkeleton = () => {
  return (
    <View className="flex-1 bg-background">
      {/* Hero Image Skeleton */}
      <Skeleton style={{ width: SCREEN_WIDTH, height: 320 }} />

      {/* Content Section */}
      <View className="px-6 pt-6">
        {/* Tags Skeleton */}
        <View className="flex-row gap-2 mb-6">
          <Skeleton className="h-8 w-20 rounded-full" />
          <Skeleton className="h-8 w-24 rounded-full" />
          <Skeleton className="h-8 w-16 rounded-full" />
        </View>

        {/* Event Info Cards Skeleton */}
        <View className="gap-3 mb-6">
          {/* Date & Time Card */}
          <View className="bg-card rounded-2xl p-4 border border-muted">
            <View className="flex-row items-center gap-4">
              <Skeleton className="w-12 h-12 rounded-xl" />
              <View className="flex-1 gap-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-32" />
              </View>
            </View>
          </View>

          {/* Location Card */}
          <View className="bg-card rounded-2xl p-4 border border-muted">
            <View className="flex-row items-center gap-4">
              <Skeleton className="w-12 h-12 rounded-xl" />
              <View className="flex-1 gap-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-5 w-40" />
              </View>
            </View>
          </View>

          {/* Attendees Count Card */}
          <View className="bg-card rounded-2xl p-4 border border-muted">
            <View className="flex-row items-center gap-4">
              <Skeleton className="w-12 h-12 rounded-xl" />
              <View className="flex-1 gap-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-5 w-28" />
              </View>
            </View>
          </View>
        </View>

        {/* Description Skeleton */}
        <View className="mb-6">
          <Skeleton className="h-6 w-40 mb-3" />
          <View className="gap-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </View>
        </View>

        {/* Attendees Section Skeleton */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-5 w-20" />
          </View>

          <View className="flex-row gap-4">
            {[...Array(4)].map((_, idx) => (
              <View
                key={idx}
                className="items-center gap-2"
                style={{ width: 80 }}
              >
                <Skeleton className="w-16 h-16 rounded-full" />
                <Skeleton className="h-3 w-16" />
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Fixed Bottom Button Skeleton */}
      <View className="absolute bottom-0 left-0 right-0 bg-background border-t border-muted px-6 py-4">
        <Skeleton className="h-14 w-full rounded-2xl" />
      </View>
    </View>
  );
};
