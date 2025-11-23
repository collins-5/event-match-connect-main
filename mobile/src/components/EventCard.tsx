import { memo } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

import type { Event } from "@/hooks/useEvents";

type Props = {
  event: Event;
};

const EventCardComponent = ({ event }: Props) => {
  return (
    <View style={styles.card}>
      {event.image_url ? (
        <Image source={{ uri: event.image_url }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]} />
      )}
      <View style={styles.body}>
        <Text style={styles.title}>{event.title}</Text>
        {event.description ? <Text style={styles.description}>{event.description}</Text> : null}
        <Text style={styles.meta}>
          {event.venue ?? "TBA"} • {new Date(event.event_date).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );
};

export const EventCard = memo(EventCardComponent);

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 16,
    overflow: "hidden"
  },
  image: {
    width: "100%",
    height: 180
  },
  imagePlaceholder: {
    backgroundColor: "rgba(255,255,255,0.1)"
  },
  body: {
    padding: 16,
    gap: 6
  },
  title: {
    fontSize: 16,
    color: "white",
    fontWeight: "600"
  },
  description: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14
  },
  meta: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 12
  }
});

