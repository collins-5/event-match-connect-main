import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import { Screen } from "@/components/Screen";
import { supabase } from "@/lib/supabase";
import { useSession } from "@/hooks/useSession";

interface Event {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  venue: string | null;
  location: string | null;
  image_url: string | null;
  tags: string[] | null;
}

interface Attendee {
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
}

export const EventDetailScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useSession();

  const [event, setEvent] = useState<Event | null>(null);
  const [isGoing, setIsGoing] = useState(false);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [attendeeCount, setAttendeeCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [toggleLoading, setToggleLoading] = useState(false);

  useEffect(() => {
    if (id) {
      loadEvent();
      loadAttendanceStatus();
      loadAttendees();
    }
  }, [id, user]);

  const loadEvent = async () => {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setEvent(data);
    } catch (error) {
      console.error("❌ Failed to load event:", error);
      Alert.alert("Error", "Failed to load event");
    } finally {
      setLoading(false);
    }
  };

  const loadAttendanceStatus = async () => {
    if (!user) return;

    try {
      const { data } = await supabase
        .from("event_attendees")
        .select("*")
        .eq("event_id", id)
        .eq("user_id", user.id)
        .eq("status", "going")
        .maybeSingle();

      setIsGoing(!!data);
    } catch (error) {
      console.error("❌ Failed to load attendance status:", error);
    }
  };

  const loadAttendees = async () => {
    try {
      const { data, error } = await supabase
        .from("event_attendees")
        .select(
          `
          user_id,
          profiles:user_id (
            full_name,
            avatar_url
          )
        `
        )
        .eq("event_id", id)
        .eq("status", "going");

      if (error) throw error;

      // Transform the data to flatten the profiles
      const transformedAttendees =
        data?.map((item: any) => ({
          user_id: item.user_id,
          full_name: item.profiles?.full_name || "Unknown",
          avatar_url: item.profiles?.avatar_url,
        })) || [];

      setAttendees(transformedAttendees);
      setAttendeeCount(transformedAttendees.length);
    } catch (error) {
      console.error("❌ Failed to load attendees:", error);
    }
  };

  const toggleAttendance = async () => {
    if (!user) {
      Alert.alert("Error", "Please sign in first");
      return;
    }

    setToggleLoading(true);
    try {
      if (isGoing) {
        await supabase
          .from("event_attendees")
          .delete()
          .eq("event_id", id)
          .eq("user_id", user.id);
        setIsGoing(false);
        setAttendeeCount((prev) => Math.max(0, prev - 1));
        Alert.alert("Success", "Removed from your events");
      } else {
        await supabase
          .from("event_attendees")
          .insert({ event_id: id, user_id: user.id, status: "going" });
        setIsGoing(true);
        setAttendeeCount((prev) => prev + 1);
        Alert.alert("Success", "Added to your events!");
      }
      // Reload attendees
      loadAttendees();
    } catch (error) {
      console.error("❌ Failed to toggle attendance:", error);
      Alert.alert("Error", "Failed to update attendance");
    } finally {
      setToggleLoading(false);
    }
  };

  if (loading) {
    return (
      <Screen>
        <View style={styles.center}>
          <ActivityIndicator color="#fff" size="large" />
          <Text style={styles.loadingText}>Loading event…</Text>
        </View>
      </Screen>
    );
  }

  if (!event) {
    return (
      <Screen>
        <View style={styles.center}>
          <Text style={styles.errorText}>Unable to load event.</Text>
        </View>
      </Screen>
    );
  }

  const eventDate = new Date(event.event_date).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text
           style={styles.backButtonText} 
          className="mb-4 text-red-500"
          
          >
            ← Back
          </Text>
        </TouchableOpacity>

        {/* Event Image */}
        {event.image_url ? (
          <Image source={{ uri: event.image_url }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]} />
        )}

        {/* Event Content Card */}
        <View style={styles.card}>
          {/* Title and Tags */}
          <Text style={styles.title}>{event.title}</Text>

          {event.tags && event.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {event.tags.map((tag, idx) => (
                <View key={idx} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Event Meta */}
          <View style={styles.metaSection}>
            <View style={styles.metaItem}>
              <Text style={styles.metaIcon}>📅</Text>
              <Text style={styles.metaText}>{eventDate}</Text>
            </View>

            {event.venue || event.location ? (
              <View style={styles.metaItem}>
                <Text style={styles.metaIcon}>📍</Text>
                <Text style={styles.metaText}>
                  {event.venue || event.location}
                </Text>
              </View>
            ) : null}

            <View style={styles.metaItem}>
              <Text style={styles.metaIcon}>👥</Text>
              <Text style={styles.metaText}>{attendeeCount} going</Text>
            </View>
          </View>

          {/* Description */}
          {event.description ? (
            <View style={styles.descriptionSection}>
              <Text style={styles.descriptionTitle}>About this event</Text>
              <Text style={styles.descriptionText}>{event.description}</Text>
            </View>
          ) : null}

          {/* Attendees Section */}
          {attendees.length > 0 ? (
            <View style={styles.attendeesSection}>
              <Text style={styles.attendeesTitle}>
                People Going ({attendees.length})
              </Text>
              <View style={styles.attendeesList}>
                {attendees.slice(0, 6).map((attendee) => (
                  <View key={attendee.user_id} style={styles.attendeeItem}>
                    <View style={styles.attendeeAvatar}>
                      {attendee.avatar_url ? (
                        <Image
                          source={{ uri: attendee.avatar_url }}
                          style={styles.avatarImage}
                        />
                      ) : (
                        <Text style={styles.avatarInitial}>
                          {attendee.full_name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                            .slice(0, 2) || "?"}
                        </Text>
                      )}
                    </View>
                    <Text style={styles.attendeeName} numberOfLines={1}>
                      {attendee.full_name}
                    </Text>
                  </View>
                ))}
              </View>
              {attendees.length > 6 && (
                <Text style={styles.moreAttendees}>
                  +{attendees.length - 6} more people
                </Text>
              )}
            </View>
          ) : null}

          {/* Action Button */}
          <TouchableOpacity
            style={[
              styles.button,
              isGoing ? styles.buttonSecondary : styles.buttonPrimary,
            ]}
            onPress={toggleAttendance}
            disabled={toggleLoading}
          >
            {toggleLoading ? (
              <ActivityIndicator color={isGoing ? "#fff" : "#fff"} />
            ) : (
              <Text style={styles.buttonText}>
                {isGoing ? "Not Going" : "I'm Going!"}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  loadingText: {
    color: "rgba(255,255,255,0.7)",
    marginTop: 8,
  },
  errorText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 16,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 0,
    marginBottom: 16,
  },
  backButtonText: {
    color: "#7c3aed",
    fontSize: 16,
    fontWeight: "600",
  },
  image: {
    width: "100%",
    height: 240,
    borderRadius: 16,
    marginBottom: 16,
  },
  imagePlaceholder: {
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 16,
    padding: 20,
    gap: 20,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "white",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    backgroundColor: "rgba(124,58,237,0.3)",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tagText: {
    color: "#a78bfa",
    fontSize: 12,
    fontWeight: "500",
  },
  metaSection: {
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
    paddingTop: 12,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  metaIcon: {
    fontSize: 20,
  },
  metaText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    flex: 1,
  },
  descriptionSection: {
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
    paddingTop: 12,
  },
  descriptionTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  descriptionText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    lineHeight: 20,
  },
  attendeesSection: {
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
    paddingTop: 12,
  },
  attendeesTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  attendeesList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  attendeeItem: {
    alignItems: "center",
    width: "30%",
    gap: 6,
  },
  attendeeAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(124,58,237,0.3)",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  avatarImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  avatarInitial: {
    color: "#a78bfa",
    fontSize: 16,
    fontWeight: "700",
  },
  attendeeName: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
    textAlign: "center",
  },
  moreAttendees: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
    fontStyle: "italic",
  },
  button: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  buttonPrimary: {
    backgroundColor: "#7c3aed",
  },
  buttonSecondary: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
});
