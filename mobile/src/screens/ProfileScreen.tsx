import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";

import { Screen } from "@/components/Screen";
import { useSession } from "@/hooks/useSession";
import { supabase } from "@/lib/supabase";

interface Profile {
  full_name: string | null;
  location: string | null;
  age: number | null;
  bio: string | null;
  avatar_url: string | null;
}

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

export const ProfileScreen = () => {
  const router = useRouter();
  const { user } = useSession();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [interests, setInterests] = useState<string[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"profile" | "going">("profile");

  useEffect(() => {
    if (user) {
      loadProfile(user.id);
      loadInterests(user.id);
      loadGoingEvents(user.id);
    }
  }, [user]);

  const loadProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error: any) {
      console.error("Failed to load profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadInterests = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("user_interests")
        .select("interest")
        .eq("user_id", userId);

      if (error) throw error;
      setInterests(data?.map((i: any) => i.interest) || []);
    } catch (error: any) {
      console.error("Failed to load interests:", error);
    }
  };

  const loadGoingEvents = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("event_attendees")
        .select(
          `
          events:event_id (
            id,
            title,
            description,
            event_date,
            venue,
            location,
            image_url,
            tags
          )
        `
        )
        .eq("user_id", userId)
        .eq("status", "going");

      if (error) throw error;

      // Transform the data to flatten events
      const transformedEvents =
        data?.map((item: any) => item.events).filter(Boolean) || [];

      setEvents(transformedEvents);
    } catch (error: any) {
      console.error("Failed to load going events:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error: any) {
      console.error("Sign out error:", error);
    }
  };

  if (loading) {
    return (
      <Screen>
        <View style={styles.center}>
          <ActivityIndicator color="#fff" size="large" />
        </View>
      </Screen>
    );
  }

  const initials =
    profile?.full_name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "?";

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Screen>
        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "profile" && styles.tabActive]}
            onPress={() => setActiveTab("profile")}
          >
            <Text
              style={[
                styles.tabLabel,
                activeTab === "profile" && styles.tabLabelActive,
              ]}
            >
              Profile
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "going" && styles.tabActive]}
            onPress={() => setActiveTab("going")}
          >
            <Text
              style={[
                styles.tabLabel,
                activeTab === "going" && styles.tabLabelActive,
              ]}
            >
              Going ({events.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Profile Tab */}
        {activeTab === "profile" ? (
          <>
            <View style={styles.card}>
              <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                  {profile?.avatar_url ? (
                    <Image
                      source={{ uri: profile.avatar_url }}
                      style={styles.avatarImage}
                    />
                  ) : (
                    <Text style={styles.avatarText}>{initials}</Text>
                  )}
                </View>
                <View>
                  <Text style={styles.headline}>
                    {profile?.full_name || "User Profile"}
                  </Text>
                  <Text style={styles.subtext}>{user?.email}</Text>
                </View>
              </View>
            </View>

            {profile?.bio && (
              <View style={styles.card}>
                <Text style={styles.label}>Bio</Text>
                <Text style={styles.value}>{profile.bio}</Text>
              </View>
            )}

            {profile?.location && (
              <View style={styles.card}>
                <Text style={styles.label}>Location</Text>
                <Text style={styles.value}>{profile.location}</Text>
              </View>
            )}

            {profile?.age && (
              <View style={styles.card}>
                <Text style={styles.label}>Age</Text>
                <Text style={styles.value}>{profile.age}</Text>
              </View>
            )}

            {interests.length > 0 && (
              <View style={styles.card}>
                <Text style={styles.label}>Interests</Text>
                <View style={styles.interestsList}>
                  {interests.map((interest, index) => (
                    <View key={index} style={styles.interestBadge}>
                      <Text style={styles.interestText}>{interest}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            <TouchableOpacity style={styles.signOut} onPress={handleSignOut}>
              <Text style={styles.signOutLabel}>Sign Out</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            {events.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  You're not going to any events yet.
                </Text>
                <Text style={styles.emptyStateSubtext}>
                  Explore events and mark them as going!
                </Text>
              </View>
            ) : (
              <View style={styles.eventsList}>
                {events.map((event) => (
                  <TouchableOpacity
                    key={event.id}
                    style={styles.eventCard}
                    onPress={() => router.push(`/event/${event.id}`)}
                  >
                    {event.image_url ? (
                      <Image
                        source={{ uri: event.image_url }}
                        style={styles.eventImage}
                      />
                    ) : (
                      <View
                        style={[
                          styles.eventImage,
                          styles.eventImagePlaceholder,
                        ]}
                      />
                    )}
                    <View style={styles.eventContent}>
                      <Text style={styles.eventTitle} numberOfLines={2}>
                        {event.title}
                      </Text>
                      <Text style={styles.eventMeta}>
                        {new Date(event.event_date).toLocaleDateString()} •{" "}
                        {event.venue || event.location || "TBA"}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </>
        )}
      </Screen>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tabs: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  tab: {
    flex: 1,
    paddingBottom: 12,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabActive: {
    borderBottomColor: "#7c3aed",
  },
  tabLabel: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 14,
    fontWeight: "600",
  },
  tabLabelActive: {
    color: "#7c3aed",
    fontWeight: "700",
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 16,
    padding: 20,
    gap: 12,
    marginBottom: 16,
  },
  avatarContainer: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  avatarImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  avatarText: {
    color: "white",
    fontSize: 24,
    fontWeight: "700",
  },
  headline: {
    fontSize: 20,
    color: "white",
    fontWeight: "700",
  },
  subtext: {
    fontSize: 14,
    color: "rgba(255,255,255,0.6)",
  },
  label: {
    color: "rgba(255,255,255,0.6)",
    textTransform: "uppercase",
    fontSize: 12,
    fontWeight: "600",
  },
  value: {
    color: "white",
    fontSize: 16,
  },
  interestsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  interestBadge: {
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  interestText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 14,
  },
  signOut: {
    backgroundColor: "rgba(255,59,48,0.2)",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 40,
  },
  signOutLabel: {
    color: "#FF3B30",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
    gap: 8,
  },
  emptyStateText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 16,
    fontWeight: "500",
  },
  emptyStateSubtext: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 14,
  },
  eventsList: {
    gap: 12,
    marginBottom: 40,
  },
  eventCard: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 12,
    overflow: "hidden",
    flexDirection: "row",
    height: 120,
  },
  eventImage: {
    width: 120,
    height: 120,
  },
  eventImagePlaceholder: {
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  eventContent: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  eventTitle: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  eventMeta: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
  },
});
