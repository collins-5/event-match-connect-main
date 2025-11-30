// components/GoingEventCard.tsx
import { TouchableOpacity, View, Text } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { memo } from "react";
import { cn } from "@/lib/utils";
import Icon from "@/components/ui/icon";

type GoingEvent = {
  id: string;
  title: string;
  description?: string | null;
  event_date: string;
  venue?: string | null;
  location?: string | null;
  image_url?: string | null;
  tags?: string[] | null;
  start_time?: string | null;
  end_time?: string | null;
};

type GoingEventCardProps = {
  event: GoingEvent;
  className?: string;
};

const GoingEventCardComponent = ({ event, className }: GoingEventCardProps) => {
  const router = useRouter();

  const formatTime = (time: string | null | undefined) => {
    if (!time) return null;
    return new Date(`2020-01-01 ${time}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const startTime = formatTime(event.start_time);
  const endTime = formatTime(event.end_time);

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => router.push(`/event/${event.id}`)}
      className={cn(
        "overflow-hidden rounded-2xl  border border-muted shadow-xl shadow-black/20 bg-card ",
        className
      )}
    >
      {/* Full-width Image */}
      {event.image_url ? (
        <Image
          source={{ uri: event.image_url }}
          className="h-48 w-48"
          resizeMode="cover"
        />
      ) : (
        <View className="h-48 w-full bg-gradient-to-br from-purple-600/20 to-blue-600/20 items-center justify-center">
          <Icon name="calendar" size={48} color="#64748b" />
        </View>
      )}

      {/* Content */}
      <View className="p-2">
        {/* Title */}
        <Text
          className="text-foreground text-xl font-bold leading-7"
          numberOfLines={2}
        >
          {event.title}
        </Text>

        {/* Description */}
        {event.description ? (
          <Text
            className="text-muted-foreground text-sm mt-2 leading-5"
            numberOfLines={2}
          >
            {event.description}
          </Text>
        ) : null}

        {/* Date + Time */}
        <View className="flex-row items-center gap-2 mt-4">
          <Icon name="calendar-clock" size={18} color="#64748b" />
          <Text className="text-foreground text-sm font-medium">
            {new Date(event.event_date).toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
            {startTime && ` · ${startTime}${endTime ? ` – ${endTime}` : ""}`}
          </Text>
        </View>

        {/* Venue / Location */}
        {(event.venue || event.location) && (
          <View className="flex-row items-center gap-2 mt-2">
            <Icon name="map-marker-radius-outline" size={18} color="#64748b" />
            <Text className="text-muted-foreground text-sm">
              {event.venue || event.location || "Location TBA"}
            </Text>
          </View>
        )}

        {/* Tags */}
        {event.tags && event.tags.length > 0 && (
          <View className="flex-row flex-wrap gap-2 mt-4 -mb-2">
            {event.tags.slice(0, 4).map((tag, i) => (
              <View
                key={i}
                className="bg-primary/10 px-3 py-1.5 rounded-full border border-primary/30"
              >
                <Text className="text-primary text-xs font-semibold">
                  {tag}
                </Text>
              </View>
            ))}
            {event.tags.length > 4 && (
              <Text className="text-muted-foreground text-xs self-center">
                +{event.tags.length - 4}
              </Text>
            )}
          </View>
        )}
      </View>

      {/* Optional subtle bottom accent */}
      <View className="h-1 bg-gradient-to-r from-primary/30 to-primary/10" />
    </TouchableOpacity>
  );
};

export const GoingEventCard = memo(GoingEventCardComponent);
