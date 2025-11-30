// hooks/usePublicProfile.ts
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
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

export const usePublicProfile = () => {
    const { id } = useLocalSearchParams() as { id: string };

    const [profile, setProfile] = useState<Profile | null>(null);
    const [interests, setInterests] = useState<string[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"profile" | "going">("profile");

    useEffect(() => {
        if (id) {
            loadProfile(id);
            loadInterests(id);
            loadGoingEvents(id);
        }
    }, [id]);

    const loadProfile = async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from("profiles")
                .select("full_name, avatar_url, bio, location, age")
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
        } catch (error) {
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

            const transformedEvents =
                data?.map((item: any) => item.events).filter(Boolean) || [];

            setEvents(transformedEvents);
        } catch (error) {
            console.error("Failed to load going events:", error);
        }
    };

    const initials =
        profile?.full_name
            ?.split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase() || "?";

    return {
        id,
        profile,
        interests,
        events,
        loading,
        activeTab,
        setActiveTab,
        initials,
    };
};