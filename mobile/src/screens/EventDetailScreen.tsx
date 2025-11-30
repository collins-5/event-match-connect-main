// screens/EventDetailScreen.tsx
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Screen } from "@/components/Screen";
import Icon from "~/components/ui/icon";
import { Button } from "~/components/ui/button";
import { EventDetailSkeleton } from "~/components/core/skeletons/event-details-skeleton";
import { useEventDetail } from "@/hooks/useEventDetail";
import { UnattendEventSheet } from "~/components/ui/sheets/unattend-event-sheet";
import { useState } from "react";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const EventDetailScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams() as { id: string };
  const [showUnattendSheet, setShowUnattendSheet] = useState(false);

  const {
    event,
    isGoing,
    attendees,
    attendeeCount,
    loading,
    toggleLoading,
    toggleAttendance, // This already handles API + state update
  } = useEventDetail(id);

  // Smart button handler
  const handleAttendancePress = () => {
    if (isGoing) {
      // Trying to remove → show confirmation
      setShowUnattendSheet(true);
    } else {
      // Trying to join → do it instantly
      toggleAttendance();
    }
  };

  // Confirm removal → just call toggleAttendance (it knows we're currently going)
  const confirmUnattend = () => {
    toggleAttendance(); // This will set isGoing(false) + call API
    setShowUnattendSheet(false);
  };

  if (loading) return <EventDetailSkeleton />;

  if (!event) {
    return (
      <Screen>
        <Text className="text-muted-foreground text-lg">Event not found</Text>
      </Screen>
    );
  }

  const eventDate = new Date(event.event_date);
  const dateString = eventDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  const timeString = eventDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Hero Image */}
        <View className="relative">
          {event.image_url ? (
            <Image
              source={{ uri: event.image_url }}
              style={{ width: SCREEN_WIDTH, height: 320 }}
              className="bg-muted"
              resizeMode="cover"
            />
          ) : (
            <View
              style={{ width: SCREEN_WIDTH, height: 320 }}
              className="bg-primary/20 items-center justify-center"
            >
              <Icon name="calendar" size={80} color="rgb(4, 116, 56)" />
            </View>
          )}

          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.7)"]}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: 140,
            }}
          />

          {/* Back Button */}
          <View className="absolute top-12 left-4">
            <Button
              variant="default"
              className="rounded-full w-12  p-0 backdrop-blur"
              onPress={() => router.back()}
              leftIcon={<Icon name="arrow-left" size={24} color="white" className='ml-4' />}
            />
          </View>

          {/* Title */}
          <View className="absolute bottom-6 left-6 right-6">
            <Text className="text-white text-3xl font-black leading-tight">
              {event.title}
            </Text>
          </View>
        </View>

        <View className="px-6 pt-6">
          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <View className="flex-row flex-wrap gap-2 mb-6">
              {event.tags.map((tag, idx) => (
                <View
                  key={idx}
                  className="bg-accent/30 border border-accent rounded-full px-4 py-2"
                >
                  <Text className="text-primary text-xs font-semibold uppercase tracking-wide">
                    {tag}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Info Cards */}
          <View className="gap-3 mb-6">
            {/* Date & Time */}
            <View className="bg-card rounded-2xl p-4 border border-muted">
              <View className="flex-row items-center gap-4">
                <View className="bg-primary/20 w-12 h-12 rounded-xl items-center justify-center">
                  <Icon
                    name="calendar-clock"
                    size={24}
                    color="rgb(4, 116, 56)"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-muted-foreground text-xs font-medium uppercase tracking-wide mb-1">
                    Date & Time
                  </Text>
                  <Text className="text-foreground text-base font-semibold">
                    {dateString}
                  </Text>
                  <Text className="text-muted-foreground text-sm">
                    {timeString}
                  </Text>
                </View>
              </View>
            </View>

            {/* Location */}
            {(event.venue || event.location) && (
              <View className="bg-card rounded-2xl p-4 border border-muted">
                <View className="flex-row items-center gap-4">
                  <View className="bg-primary/20 w-12 h-12 rounded-xl items-center justify-center">
                    <Icon
                      name="map-marker-radius-outline"
                      size={24}
                      color="rgb(4, 116, 56)"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-muted-foreground text-xs font-medium uppercase tracking-wide mb-1">
                      Location
                    </Text>
                    <Text className="text-foreground text-base font-semibold">
                      {event.venue || event.location}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            <View className="bg-card rounded-2xl p-4 border border-muted">
              <View className="flex-row items-center gap-4">
                <View className="bg-primary/20 w-12 h-12 rounded-xl items-center justify-center">
                  <Icon
                    name="account-group"
                    size={24}
                    color="rgb(4, 116, 56)"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-muted-foreground text-xs font-medium uppercase tracking-wide mb-1">
                    Attendees
                  </Text>
                  <Text className="text-foreground text-base font-semibold">
                    {attendeeCount} {attendeeCount === 1 ? "person" : "people"}{" "}
                    going
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Description */}
          {event.description && (
            <View className="mb-6">
              <Text className="text-foreground text-lg font-bold mb-3">
                About This Event
              </Text>
              <Text className="text-foreground/80 text-base leading-7">
                {event.description}
              </Text>
            </View>
          )}

          {/* Attendees List */}
          {attendees.length > 0 && (
            <View className="mb-6">
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-foreground text-lg font-bold">
                  Who's Going
                </Text>
                <Text className="text-primary text-sm font-semibold">
                  {attendees.length}{" "}
                  {attendees.length === 1 ? "person" : "people"}
                </Text>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 16, paddingRight: 24 }}
              >
                {attendees.map((attendee) => (
                  <TouchableOpacity
                    key={attendee.user_id}
                    onPress={() => {
                      router.push(`/public-profile/${attendee.user_id}`);
                    }}
                    className="items-center gap-2"
                    style={{ width: 80 }}
                    activeOpacity={0.7}
                  >
                    <View className="relative">
                      {attendee.avatar_url ? (
                        <Image
                          source={{ uri: attendee.avatar_url }}
                          className="w-16 h-16 rounded-full border-2 border-primary/30"
                        />
                      ) : (
                        <View className="w-16 h-16 rounded-full bg-primary justify-center items-center border-2 border-primary/50">
                          <Text className="text-primary-foreground text-lg font-bold">
                            {attendee.full_name
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                              .slice(0, 2) || "?"}
                          </Text>
                        </View>
                      )}
                    </View>
                    <Text
                      className="text-foreground text-xs text-center font-medium"
                      numberOfLines={2}
                    >
                      {attendee.full_name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View className="absolute bottom-0 left-0 right-0 px-6 pb-8 pt-4 bg-background">
        <TouchableOpacity
          onPress={handleAttendancePress}
          disabled={toggleLoading}
          className={`rounded-2xl py-5 items-center flex-row justify-center gap-3 ${
            isGoing ? "bg-muted border-2 border-primary" : "bg-primary"
          }`}
          style={{
            shadowColor: isGoing ? "transparent" : "rgb(4, 116, 56)",
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.34,
            shadowRadius: 12,
            elevation: 12,
          }}
        >
          {toggleLoading ? (
            <ActivityIndicator color={isGoing ? "rgb(4, 116, 56)" : "white"} />
          ) : (
            <>
              <Icon
                name={isGoing ? "check-circle-outline" : "calendar-clock"}
                size={24}
                color={isGoing ? "rgb(4, 116, 56)" : "white"}
              />
              <Text
                className={`text-lg font-bold ${
                  isGoing ? "text-primary" : "text-primary-foreground"
                }`}
              >
                {isGoing ? "You're Going!" : "I'm Going!"}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Confirmation Sheet */}
      <UnattendEventSheet
        visible={showUnattendSheet}
        isLoading={toggleLoading}
        onConfirm={confirmUnattend}
        onClose={() => setShowUnattendSheet(false)}
      />
    </View>
  );
};
