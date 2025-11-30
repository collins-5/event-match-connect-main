import { useEffect, useState } from "react";
import { Alert } from "react-native";
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

interface UseEventDetailReturn {
    event: Event | null;
    isGoing: boolean;
    attendees: Attendee[];
    attendeeCount: number;
    loading: boolean;
    toggleLoading: boolean;
    toggleAttendance: () => Promise<void>;
    loadEvent: () => Promise<void>;
}

export const useEventDetail = (eventId: string): UseEventDetailReturn => {
    const { user } = useSession();

    const [event, setEvent] = useState<Event | null>(null);
    const [isGoing, setIsGoing] = useState(false);
    const [attendees, setAttendees] = useState<Attendee[]>([]);
    const [attendeeCount, setAttendeeCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [toggleLoading, setToggleLoading] = useState(false);

    const loadEvent = async () => {
        try {
            const { data, error } = await supabase
                .from("events")
                .select("*")
                .eq("id", eventId)
                .single();

            if (error) throw error;
            setEvent(data);
        } catch (error: any) {
            console.error("Failed to load event:", error);
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
                .eq("event_id", eventId)
                .eq("user_id", user.id)
                .eq("status", "going")
                .maybeSingle();

            setIsGoing(!!data);
        } catch (error) {
            console.error("Failed to load attendance status:", error);
        }
    };

    const loadAttendees = async () => {
        try {
            const { data, error } = await supabase
                .from("event_attendees")
                .select(`
          user_id,
          profiles:user_id (
            full_name,
            avatar_url
          )
        `)
                .eq("event_id", eventId)
                .eq("status", "going");

            if (error) throw error;

            const transformedAttendees =
                data?.map((item: any) => ({
                    user_id: item.user_id,
                    full_name: item.profiles?.full_name || "Unknown",
                    avatar_url: item.profiles?.avatar_url,
                })) || [];

            setAttendees(transformedAttendees);
            setAttendeeCount(transformedAttendees.length);
        } catch (error) {
            console.error("Failed to load attendees:", error);
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
                    .eq("event_id", eventId)
                    .eq("user_id", user.id);

                setIsGoing(false);
                setAttendeeCount((prev) => Math.max(0, prev - 1));
                Alert.alert("Success", "Removed from your events");
            } else {
                await supabase
                    .from("event_attendees")
                    .insert({ event_id: eventId, user_id: user.id, status: "going" });

                setIsGoing(true);
                setAttendeeCount((prev) => prev + 1);
                Alert.alert("Success", "Added to your events!");
            }
            await loadAttendees(); // Refresh attendee list
        } catch (error: any) {
            console.error("Failed to toggle attendance:", error);
            Alert.alert("Error", "Failed to update attendance");
        } finally {
            setToggleLoading(false);
        }
    };

    useEffect(() => {
        if (eventId) {
            loadEvent();
            loadAttendanceStatus();
            loadAttendees();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [eventId, user]);

    return {
        event,
        isGoing,
        attendees,
        attendeeCount,
        loading,
        toggleLoading,
        toggleAttendance,
        loadEvent,
    };
};