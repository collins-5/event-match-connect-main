import { memo } from "react";
import { Image, Text, View, Platform } from "react-native";

import type { Event } from "@/hooks/useEvents";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Icon from "./ui/icon";

type Props = {
  event: Event;
};

const EventCardComponent = ({ event }: Props) => {
  return (
    <Card className="overflow-hidden rounded-2xl border my-1 shadow-xl shadow-black/20">
      {/* Event Image or Placeholder */}
      {event.image_url ? (
        <Image
          source={{ uri: event.image_url }}
          className="h-48 w-full"
          resizeMode="cover"
        />
      ) : (
        <View className="h-48 w-full bg-gradient-to-br from-purple-600/20 to-blue-600/20" />
      )}

      {/* Card Content */}
      <CardHeader withSeparator>
        <CardTitle className="">{event.title}</CardTitle>
        {event.description ? (
          <CardDescription className="">{event.description}</CardDescription>
        ) : null}
      </CardHeader>
      <CardFooter className="pb-4 mt-2">
        <View>
          <View className="flex-row items-center">
            <Icon name="map-marker-radius-outline" size={18} color="#64748b" />

            <Text className="ml-2 text-xs ">
              {event.venue ?? "Venue TBA"} •{" "}
            </Text>
            <Icon name="calendar-clock" size={18} color="#64748b" />

            <Text className="ml-2 text-xs ">
              {new Date(event.event_date).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </Text>
          </View>
          <View>
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
        </View>
      </CardFooter>
    </Card>
  );
};

export const EventCard = memo(EventCardComponent);
