import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";

import { EventCard } from "@/components/EventCard";
import { Screen } from "@/components/Screen";
import { useSession } from "@/hooks/useSession";
import { supabase } from "@/lib/supabase";

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

const INTEREST_OPTIONS = [
  "Music",
  "Sports",
  "Art",
  "Food",
  "Technology",
  "Gaming",
  "Fitness",
  "Travel",
  "Photography",
  "Reading",
  "Movies",
  "Dancing",
];

export const EventsScreen = () => {
  const router = useRouter();
  const { user } = useSession();
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    console.log("📋 EventsScreen useEffect: user =", user?.id);
    if (user) {
      console.log("✅ User authenticated, loading events");
      loadEvents();
    } else {
      console.log("❌ User not authenticated");
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    filterEvents();
  }, [events, searchQuery, selectedTags]);

  const loadEvents = async () => {
    try {
      setIsLoading(true);
      console.log("🔄 Loading events from Supabase...");

      // Check authentication status
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
      console.log("🔐 Auth Session:", {
        hasSession: !!session,
        userId: session?.user?.id,
        error: sessionError,
      });

      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("event_date", { ascending: true });

      console.log("📊 Supabase Response:", { data, error });
      if (error) {
        console.error("❌ Supabase Error:", error);
        throw error;
      }
      console.log(`✅ Events fetched: ${data?.length || 0} events`);
      console.log("📋 Events data:", data);
      setEvents(data || []);
    } catch (error) {
      console.error("❌ Failed to load events:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterEvents = () => {
    console.log("🔍 Filtering events...", {
      totalEvents: events.length,
      searchQuery,
      selectedTags,
    });
    let filtered = events;

    if (searchQuery) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      console.log(`  📝 After search filter: ${filtered.length} events`);
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter((event) =>
        event.tags?.some((tag) => selectedTags.includes(tag))
      );
      console.log(`  🏷️ After tag filter: ${filtered.length} events`);
    }

    console.log(`✨ Final filtered events: ${filtered.length}`);
    setFilteredEvents(filtered);
  };

  const toggleTag = (tag: string) => {
    console.log(`🏷️ Toggling tag: ${tag}`);
    setSelectedTags((prev) => {
      const updated = prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag];
      console.log(`  Selected tags now: ${updated.join(", ") || "none"}`);
      return updated;
    });
  };

  const refetch = () => {
    console.log("🔄 Refetching events...");
    loadEvents();
  };

  console.log("📱 EventsScreen Render State:", {
    isLoading,
    totalEvents: events.length,
    filteredEventsCount: filteredEvents.length,
    searchQuery,
    selectedTagsCount: selectedTags.length,
  });

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>Discover Events</Text>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search events..."
            placeholderTextColor="rgba(255,255,255,0.4)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Text style={styles.filterButtonText}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {showFilters && (
          <View style={styles.filtersContainer}>
            <Text style={styles.filtersTitle}>Filter by Interests</Text>
            <View style={styles.tagsGrid}>
              {INTEREST_OPTIONS.map((tag) => (
                <TouchableOpacity
                  key={tag}
                  style={[
                    styles.tagBadge,
                    selectedTags.includes(tag) && styles.tagBadgeActive,
                  ]}
                  onPress={() => toggleTag(tag)}
                >
                  <Text
                    style={[
                      styles.tagBadgeText,
                      selectedTags.includes(tag) && styles.tagBadgeTextActive,
                    ]}
                  >
                    {tag}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {selectedTags.length > 0 && (
          <View style={styles.selectedTagsContainer}>
            {selectedTags.map((tag) => (
              <TouchableOpacity
                key={tag}
                style={styles.selectedTag}
                onPress={() => toggleTag(tag)}
              >
                <Text style={styles.selectedTagText}>{tag} ✕</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color="#fff" size="large" />
          <Text style={styles.loading}>Loading events…</Text>
        </View>
      ) : filteredEvents.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>
            No events found matching your criteria
          </Text>
        </View>
      ) : (
        (() => {
          const safeEvents = Array.isArray(filteredEvents)
            ? filteredEvents
            : [];
          console.log("📚 Rendering events list, count:", safeEvents.length);
          if (!Array.isArray(filteredEvents)) {
            console.warn(
              "⚠️ filteredEvents is not an array, falling back to empty list",
              filteredEvents
            );
          }

          if (safeEvents.length === 0) {
            return (
              <View style={styles.center}>
                <Text style={styles.emptyText}>
                  No events found matching your criteria
                </Text>
              </View>
            );
          }

          return (
            <FlashList
              data={safeEvents}
              keyExtractor={(item: any) => item.id}
              contentContainerStyle={styles.list}
              refreshing={isLoading}
              onRefresh={refetch}
              renderItem={({ item }: any) => (
                <TouchableOpacity
                  onPress={() => router.push(`/event/${item.id}`)}
                >
                  <EventCard event={item} />
                </TouchableOpacity>
              )}
              estimatedItemSize={250}
            />
          );
        })()
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: 16,
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "white",
  },
  searchContainer: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "white",
    fontSize: 14,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  filterButtonText: {
    fontSize: 18,
  },
  filtersContainer: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  filtersTitle: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    fontWeight: "600",
  },
  tagsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tagBadge: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tagBadgeActive: {
    backgroundColor: "#7c3aed",
  },
  tagBadgeText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    fontWeight: "500",
  },
  tagBadgeTextActive: {
    color: "white",
  },
  selectedTagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  selectedTag: {
    backgroundColor: "rgba(124,58,237,0.3)",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  selectedTagText: {
    color: "#a78bfa",
    fontSize: 12,
    fontWeight: "500",
  },
  center: {
    paddingVertical: 32,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  loading: {
    color: "rgba(255,255,255,0.7)",
    marginTop: 8,
  },
  emptyText: {
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
  },
  list: {
    gap: 16,
    paddingBottom: 96,
  },
});
