// components/core/skeletons/GoingEventCardSkeleton.tsx
import { View } from "react-native";
import { Skeleton } from "@/components/ui/skeleton"; // ← your existing skeleton
import { cn } from "@/lib/utils";

export const GoingEventCardSkeleton = () => {
  return (
    <View
      className={cn(
        "bg-card border border-muted rounded-2xl overflow-hidden",
        "shadow-sm" // optional: matches your card shadow
      )}
    >
      <View className="flex-row">
        {/* Image Placeholder */}
        <Skeleton className="w-32 h-32" />

        {/* Text Content */}
        <View className="flex-1 p-4 justify-between">
          {/* Title */}
          <Skeleton className="h-6 w-11/12 rounded-lg" />
          <Skeleton className="h-6 w-9/12 rounded-lg mt-2" />

          {/* Date Row */}
          <View className="flex-row items-center gap-1.5 mt-3">
            <Skeleton className="w-4 h-4 rounded" />
            <Skeleton className="h-4 w-32 rounded-full" />
          </View>

          {/* Location Row */}
          <View className="flex-row items-center gap-1.5 mt-2">
            <Skeleton className="w-4 h-4 rounded" />
            <Skeleton className="h-4 w-40 rounded-full" />
          </View>

          {/* Tags */}
          <View className="flex-row gap-2 mt-4">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-14 rounded-full" />
          </View>
        </View>
      </View>

      {/* Bottom accent bar */}
      <Skeleton className="h-1 w-full" />
    </View>
  );
};
