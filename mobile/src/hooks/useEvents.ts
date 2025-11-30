// hooks/useEvents.ts
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useSession } from "@/hooks/useSession";

export interface Event {
  id: string;
  title: string;
  description: string | null | undefined;
  event_date: string;
  venue: string | null;
  location: string | null;
  image_url: string | null;
  tags: string[] | null;
}

export const useEvents = () => {
  const { user } = useSession();

  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load all events
  const loadEvents = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("event_date", { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error("Failed to load events:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load when user is ready
  useEffect(() => {
    if (user) {
      loadEvents();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  // Filter logic
  useEffect(() => {
    let filtered = events;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(query) ||
          event.description?.toLowerCase().includes(query)
      );
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter((event) =>
        event.tags?.some((tag) => selectedTags.includes(tag))
      );
    }

    setFilteredEvents(filtered);
  }, [events, searchQuery, selectedTags]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearTags = () => setSelectedTags([]);
  const clearSearch = () => {
    setSearchQuery("");
    clearTags();
  };

  const refetch = () => loadEvents();

  return {
    events,
    filteredEvents,
    searchQuery,
    setSearchQuery,
    selectedTags,
    isLoading,
    toggleTag,
    clearTags,
    clearSearch,
    refetch,
  };
};