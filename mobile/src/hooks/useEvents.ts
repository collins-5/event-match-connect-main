import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export type Event = {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  venue: string | null;
  location: string | null;
  image_url: string | null;
  tags: string[] | null;
};

const fetchEvents = async (): Promise<Event[]> => {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("event_date", { ascending: true })
    .limit(20);

  if (error) throw error;
  return data ?? [];
};

export const useEvents = () =>
  useQuery({
    queryKey: ["events"],
    queryFn: fetchEvents
  });

