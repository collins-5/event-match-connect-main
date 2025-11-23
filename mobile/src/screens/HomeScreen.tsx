import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native-gesture-handler";

import { EventCard } from "@/components/EventCard";
import { Screen } from "@/components/Screen";
import { useSession } from "@/hooks/useSession";
import { supabase } from "@/lib/supabase";

interface Profile {
  full_name: string | null;
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

export const HomeScreen = () => {
  const router = useRouter();
  const { user } = useSession();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadProfile(user.id);
      loadEvents();
    }
  }, [user]);

  const loadProfile = async (userId: string) => {
    try {
      const { data } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", userId)
        .single();

      if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error("Failed to load profile:", error);
    }
  };

  const loadEvents = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("event_date", { ascending: true })
        .limit(20);

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error("Failed to load events:", error);
      Alert.alert("Error", "Failed to load events");
    } finally {
      setIsLoading(false);
    }
  };

  const refetch = () => {
    loadEvents();
  };

  const getAISuggestions = async () => {
    if (!user || suggestionsLoading || events.length === 0) return;

    setSuggestionsLoading(true);
    try {
      // Get user interests
      const { data: userInterests } = await supabase
        .from("user_interests")
        .select("interest")
        .eq("user_id", user.id);

      const interestsList = (userInterests || []).map((ui: any) => ui.interest);

      const prompt =
        interestsList.length > 0
          ? `Based on a user interested in: ${interestsList.join(", ")}, suggest the 3 best events for them. Consider timing, relevance, and vibe match. Provide specific reasons why each event would be perfect.\n\nAvailable events:\n${events
              .map(
                (e: any) =>
                  `- ${e.title} (${e.event_date}) at ${e.venue || e.location}${
                    e.description ? " - " + e.description : ""
                  }`
              )
              .join("\n")}`
          : `Based on the available events, suggest 3 well-organized events with good timing and variety.\n\nAvailable events:\n${events
              .map(
                (e: any) =>
                  `- ${e.title} (${e.event_date}) at ${e.venue || e.location}${
                    e.description ? " - " + e.description : ""
                  }`
              )
              .join("\n")}`;

      const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) {
        Alert.alert("Error", "Supabase configuration is missing");
        return;
      }

      const response = await fetch(
        `${supabaseUrl}/functions/v1/matchbot-chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${supabaseKey}`,
          },
          body: JSON.stringify({
            messages: [
              {
                role: "user",
                content: prompt,
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get AI suggestions");
      }

      // Stream the response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let suggestion = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (!line.trim() || line.startsWith(":")) continue;
            if (!line.startsWith("data: ")) continue;

            const dataStr = line.slice(6);
            if (dataStr === "[DONE]") continue;

            try {
              const parsed = JSON.parse(dataStr);
              const delta = parsed.choices?.[0]?.delta?.content;
              if (delta) {
                suggestion += delta;
              }
            } catch (e) {
              console.error("Failed to parse SSE data:", e);
            }
          }
        }
      }

      if (suggestion) {
        Alert.alert("AI Suggestions", suggestion.substring(0, 200) + "...");
      }
    } catch (error: any) {
      console.error("AI suggestions error:", error);
      Alert.alert("Error", "Failed to generate AI suggestions");
    } finally {
      setSuggestionsLoading(false);
    }
  };

  const userName = profile?.full_name?.split(" ")[0] || "Friend";

  return (
    <Screen>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>EventMatch</Text>
          <Text style={styles.subtitle}>
            Discover events that match your vibe
          </Text>
          {user && (
            <Text style={styles.greeting}>Welcome back, {userName}!</Text>
          )}
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.suggestButton,
          (suggestionsLoading || events.length === 0) &&
            styles.suggestButtonDisabled,
        ]}
        onPress={getAISuggestions}
        disabled={suggestionsLoading || events.length === 0}
      >
        <Text style={styles.suggestText}>
          {suggestionsLoading ? "Generating..." : "✨ Get AI Suggestions"}
        </Text>
      </TouchableOpacity>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color="#fff" />
          <Text style={styles.loadingLabel}>Loading events…</Text>
        </View>
      ) : (
        <FlashList
          data={events}
          keyExtractor={(item: any) => item.id}
          renderItem={({ item }: any) => (
            <TouchableOpacity onPress={() => router.push(`/event/${item.id}`)}>
              <EventCard event={item} />
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.list}
          refreshing={isLoading}
          onRefresh={refetch}
          estimatedItemSize={250}
          ListEmptyComponent={
            <Text style={styles.empty}>
              No events available yet. Check back soon!
            </Text>
          }
        />
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  header: {
    gap: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "white",
  },
  subtitle: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
  },
  greeting: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 14,
    marginTop: 4,
  },
  suggestButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#7c3aed",
    alignItems: "center",
    marginBottom: 16,
  },
  suggestButtonDisabled: {
    backgroundColor: "rgba(124,58,237,0.5)",
    opacity: 0.6,
  },
  suggestText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  center: {
    paddingVertical: 32,
    alignItems: "center",
    gap: 8,
  },
  loadingLabel: {
    color: "rgba(255,255,255,0.7)",
  },
  list: {
    gap: 16,
    paddingBottom: 96,
  },
  empty: {
    textAlign: "center",
    color: "rgba(255,255,255,0.7)",
    marginTop: 24,
  },
});
