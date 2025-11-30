import { View } from "react-native";
import { Card, CardHeader, CardFooter } from "../../ui/card";
import { Skeleton } from "../../ui/skeleton";

export const EventCardSkeleton = () => {
  const hasDescription = Math.random() > 0.3; // 70% chance

  return (
    <Card className="overflow-hidden rounded-2xl border my-1 shadow-xl shadow-black/20">
      <Skeleton className="h-48 w-full" />

      <CardHeader withSeparator>
        <Skeleton className="h-7 w-4/5 rounded-lg" />

        {hasDescription && (
          <View className="mt-2 space-y-2">
            <Skeleton className="h-4 w-full rounded-lg" />
            <Skeleton className="h-4 w-10/12 rounded-lg" />
            <Skeleton className="h-4 w-7/12 rounded-lg" />
          </View>
        )}
      </CardHeader>

      <CardFooter className="pb-4 pt-0">
        <Skeleton className="h-4 w-56 rounded-lg" />
      </CardFooter>
    </Card>
  );
};
