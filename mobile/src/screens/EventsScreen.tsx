import { Text, TouchableOpacity, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useState } from "react";
import { useRouter } from "expo-router";

import { EventCard } from "@/components/EventCard";
import { Input } from "~/components/ui/input";
import Icon from "~/components/ui/icon";
import { Button } from "~/components/ui/button";
import { FilterBottomSheet } from "~/components/ui/sheets/filter-sheet";
import SkeletonList from "~/components/core/SkeletonList";
import { EventCardSkeleton } from "~/components/core/skeletons/event-card-skeleton";
import NoResultFound from "~/components/core/no-results-found";
import { useEvents } from "@/hooks/useEvents";
import { EventsHeader } from "~/components/core/events-header";

export const EventsScreen = () => {
  const router = useRouter();

  const {
    filteredEvents,
    searchQuery,
    setSearchQuery,  
    selectedTags,
    isLoading,
    toggleTag,
    clearTags,
    clearSearch,
    refetch,
  } = useEvents();

  const [showFilters, setShowFilters] = useState(false);

  return (
    <View className="flex-1 bg-primary">
      <EventsHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setShowFilters={setShowFilters}
        selectedTags={selectedTags}
      />
      <View className="flex-1 bg-muted px-4 pt-1">
        {isLoading ? (
          <SkeletonList count={6} skeletonComponent={EventCardSkeleton} />
        ) : (
          <FlashList
            data={filteredEvents}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ gap: 1, paddingBottom: 6 }}
            refreshing={isLoading}
            onRefresh={refetch}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => router.push(`/event/${item.id}`)}
              >
                <EventCard event={item} />
              </TouchableOpacity>
            )}
            estimatedItemSize={250}
            ListFooterComponent={
              <View className="pl-4 mt-4 pr-6 items-center justify-center">
                <Text className="text-primary font-semibold text-base">
                  End of event's List
                </Text>
              </View>
            }
            ListEmptyComponent={
              <View className="mt-16">
                <NoResultFound
                  title="Opps No events found"
                  message="No events found matching your criteria. clear search or filters"
                  showClearButton
                  icon={
                    <Icon
                      name="alert"
                      size={25}
                      className="text-muted-foreground"
                    />
                  }
                  onClear={clearSearch}
                />
              </View>
            }
          />
        )}

        <FilterBottomSheet
          visible={showFilters}
          clearTags={clearTags}
          selectedTags={selectedTags}
          onToggleTag={toggleTag}
          onClose={() => setShowFilters(false)}
        />
      </View>
    </View>
  );
};
