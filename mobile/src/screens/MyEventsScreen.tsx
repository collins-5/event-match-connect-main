import { Text, TouchableOpacity, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";

import { EventCard } from "@/components/EventCard";
import Icon from "~/components/ui/icon";

import SkeletonList from "~/components/core/SkeletonList";
import { EventCardSkeleton } from "~/components/core/skeletons/event-card-skeleton";

import { useProfile } from "~/hooks/useProfile";
import HeaderSafeAreaView from "~/components/core/header-safe-area-view";

type Event = {
  id: string;
  title: string;
  description?: string | null | undefined;
  event_date: string;
  venue?: string | null;
  location?: string | null;
  image_url?: string | null;
  tags?: string[] | null;
  start_time?: string | null;
  end_time?: string | null;
};

export const MyEventsScreen = () => {
  const router = useRouter();

  const {
    profile,
    initials,
    refetch,
    events: goingEvents = [], // ← Now correctly typed + default
    loading: isLoadingGoing,
  } = useProfile();

  return (
    <>     
    <View className="flex-1 bg-primary">
      <View className="mb-2 px-4 pt-6">
        <Text className="text-3xl font-bold tracking-tight text-primary-foreground">
          My Upcoming Events
        </Text>
      </View>
      <View className="flex-1 bg-muted  px-4 pt-2">
        {isLoadingGoing ? (
          <SkeletonList count={6} skeletonComponent={EventCardSkeleton} />
        ) : (
          <FlashList<Event>
            data={goingEvents}
            keyExtractor={(item) => item.id}
            estimatedItemSize={120}
            showsVerticalScrollIndicator={false}
            contentContainerClassName="pb-0"
            onRefresh={refetch}
            ItemSeparatorComponent={() => <View className="w-1" />}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => router.push(`/event/${item.id}`)}
              >
                <EventCard event={item} />
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <View className="items-center justify-center py-16 gap-4">
                <View className="bg-muted/50 w-20 h-20 rounded-full items-center justify-center">
                  <Icon name="calendar" size={40} color="rgb(105, 105, 105)" />
                </View>
                <Text className="text-foreground text-lg font-semibold">
                  No upcoming events
                </Text>
                <Text className="text-muted-foreground text-sm text-center px-8">
                  Events you mark as “Going” will appear here
                </Text>
              </View>
            }
            ListFooterComponent={
              goingEvents.length > 0 && goingEvents.length > 2 ? (
                <View className="py-8 px-4 items-center justify-center">
                  <Text className="text-primary font-semibold text-base">
                    End of event's list
                  </Text>
                </View>
              ) : null
            }
          />
        )}
      </View>
    </View>
    </>
  );
};
