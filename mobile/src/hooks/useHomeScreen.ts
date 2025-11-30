// hooks/useHomeScreen.ts
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { supabase } from "@/lib/supabase";
import { useSession } from "@/hooks/useSession";

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

export const useHomeScreen = () => {
    const { user } = useSession();

    const [events, setEvents] = useState<Event[]>([]);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
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

            if (data) setProfile(data);
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

    const refetch = () => loadEvents();

    const getAISuggestions = async () => {
        if (!user || suggestionsLoading || events.length === 0) return;

        setSuggestionsLoading(true);
        try {
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
                                `- ${e.title} (${e.event_date}) at ${e.venue || e.location}${e.description ? " - " + e.description : ""
                                }`
                        )
                        .join("\n")}`
                    : `Based on the available events, suggest 3 well-organized events with good timing and variety.\n\nAvailable events:\n${events
                        .map(
                            (e: any) =>
                                `- ${e.title} (${e.event_date}) at ${e.venue || e.location}${e.description ? " - " + e.description : ""
                                }`
                        )
                        .join("\n")}`;

            const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
            const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

            if (!supabaseUrl || !supabaseKey) {
                Alert.alert("Error", "Supabase configuration is missing");
                return;
            }

            const response = await fetch(`${supabaseUrl}/functions/v1/matchbot-chat`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${supabaseKey}`,
                },
                body: JSON.stringify({
                    messages: [{ role: "user", content: prompt }],
                }),
            });

            if (!response.ok) throw new Error("Failed to get AI suggestions");

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
                            if (delta) suggestion += delta;
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

    return {
        events,
        isLoading,
        userName,
        suggestionsLoading,
        refetch,
        getAISuggestions,
    };
};