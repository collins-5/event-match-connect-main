import { Text, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native-gesture-handler";

import { EventCard } from "@/components/EventCard";
import { useSession } from "@/hooks/useSession";
import SkeletonList from "@/components/core/SkeletonList";
import { EventCardSkeleton } from "~/components/core/skeletons/event-card-skeleton";
import { useHomeScreen } from "@/hooks/useHomeScreen";
import Icon from "~/components/ui/icon";
import { Image } from "expo-image";
import { useProfile } from "~/hooks/useProfile";
import { GoingEventCard } from "~/components/GoingEventCard";
import { GoingEventCardSkeleton } from "~/components/core/skeletons/GoingEventCardSkeleton";
import { HomeHeader } from "~/components/core/home-header";
import { Button } from "~/components/ui/button";
import NoResultFound from "~/components/core/no-results-found";
import { useState } from "react";
import { SettingsDrawer } from "~/components/ui/sheets/settings-drawer";
import HeaderSafeAreaView from "~/components/core/header-safe-area-view";

export const HomeScreen = () => {
  const router = useRouter();
  const { user } = useSession();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const {
    events: recommendedEvents,
    isLoading: isLoadingRecommended,
    userName,
    refetch,
  } = useHomeScreen();

  const {
    profile,
    initials,
    events: goingEvents = [], // ← Now correctly typed + default
    loading: isLoadingGoing,
    refetch: goingRefetch,
  } = useProfile();

  const SettingsOpen = () => {
    setSettingsOpen(true);
  };

  const handleRefresh = async () => {
    await Promise.all([refetch(), goingRefetch()]);
  };

  return (
    <>
      <View className="flex-1 bg-primary">
        <HomeHeader
          userName={userName}
          initials={initials}
          avatarUrl={profile?.avatar_url}
          loading={isLoadingGoing}
          SettingsOpen={SettingsOpen}
          settingsOpen={settingsOpen}
        />
        <View className="flex-1 bg-muted  px-4 pt-2">
          <Text className="text-2xl font-bold text-foreground">
            My Upcoming Events
          </Text>
          {isLoadingGoing ? (
            <SkeletonList
              count={1}
              skeletonComponent={GoingEventCardSkeleton}
            />
          ) : (
            <View className="">
              <FlashList
                data={goingEvents}
                keyExtractor={(item) => item.id}
                estimatedItemSize={200}
                showsHorizontalScrollIndicator={false}
                horizontal={true}
                style={{ height: 170 }}
                onRefresh={handleRefresh}
                ItemSeparatorComponent={() => <View className="w-1" />}
                renderItem={({ item }) => (
                  <View className="w-[300]">
                    <GoingEventCard event={item} />
                  </View>
                )}
                ListEmptyComponent={
                  <View className="items-center justify-center py-16 gap-4 w-[350]">
                    <View className="bg-muted/50 w-20 h-20 rounded-full items-center justify-center">
                      <Icon
                        name="calendar"
                        size={40}
                        color="rgb(105, 105, 105)"
                      />
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
                  goingEvents.length > 1 ? (
                    <View className="pl-4 mt-16 w-[100] items-center justify-center">
                      <Button
                        variant="link"
                        text="View All"
                        className="w-full"
                        onPress={() => router.push("/my-events")}
                      />
                    </View>
                  ) : undefined
                }
              />
            </View>
          )}
          <Text className="text-2xl font-bold text-foreground mb-1">
            Recommended For You
          </Text>

          {isLoadingRecommended ? (
            <SkeletonList count={6} skeletonComponent={EventCardSkeleton} />
          ) : (
            <FlashList
              data={recommendedEvents}
              keyExtractor={(item: any) => item.id}
              renderItem={({ item }: any) => (
                <TouchableOpacity
                  onPress={() => router.push(`/event/${item.id}`)}
                >
                  <EventCard event={item} />
                </TouchableOpacity>
              )}
              estimatedItemSize={250}
              contentContainerClassName="pb-2"
              ItemSeparatorComponent={() => <View className="h-1" />}
              ListEmptyComponent={
                <Text className="text-center text-muted-foreground mt-10">
                  No recommended events yet. Check back soon!
                </Text>
              }
              onRefresh={handleRefresh}
              ListFooterComponent={
                <View className="pl-4 mt-4 pr-6 items-center justify-center">
                  <Text className="text-primary font-semibold text-base">
                    End of event's List
                  </Text>
                </View>
              }
            />
          )}
        </View>
      </View>
      <SettingsDrawer
        visible={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        userName={userName}
        initials={initials}
        avatarUrl={profile?.avatar_url}
        loading={isLoadingGoing}
      />
    </>
  );
};
