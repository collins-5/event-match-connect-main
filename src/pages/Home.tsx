import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import BottomNav from "@/components/BottomNav";
import ChatBot from "@/components/ChatBot";
import EventCard from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";

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

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        loadEvents();
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadEvents = async () => {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("event_date", { ascending: true })
        .limit(20);

      if (error) throw error;
      setEvents(data || []);
    } catch (error: any) {
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const getAISuggestions = async () => {
    if (!user || suggestionsLoading) return;

    setSuggestionsLoading(true);
    try {
      // Get user interests
      const { data: userInterests } = await supabase
        .from("user_interests")
        .select("interest")
        .eq("user_id", user.id);

      const interestsList = userInterests?.map((ui) => ui.interest) || [];

      const prompt =
        interestsList.length > 0
          ? `Based on a user interested in: ${interestsList.join(
              ", "
            )}, suggest the 3 best events for them. Consider timing, relevance, and vibe match. Provide specific reasons why each event would be perfect.\n\nAvailable events:\n${events
              .map(
                (e) =>
                  `- ${e.title} (${e.event_date}) at ${e.venue || e.location}${
                    e.description ? " - " + e.description : ""
                  }`
              )
              .join("\n")}`
          : `Based on the available events, suggest 3 well-organized events with good timing and variety.\n\nAvailable events:\n${events
              .map(
                (e) =>
                  `- ${e.title} (${e.event_date}) at ${e.venue || e.location}${
                    e.description ? " - " + e.description : ""
                  }`
              )
              .join("\n")}`;

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/matchbot-chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
            }`,
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

            const data = line.slice(6);
            if (data === "[DONE]") continue;

            try {
              const parsed = JSON.parse(data);
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
        toast.success("AI Suggestions Generated!", {
          description: suggestion.substring(0, 100) + "...",
        });
      }
    } catch (error: any) {
      console.error("AI suggestions error:", error);
      toast.error("Failed to generate AI suggestions");
    } finally {
      setSuggestionsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-hero pb-20">
      <div className="max-w-screen-xl mx-auto p-4 space-y-6">
        <header className="pt-4">
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
            EventMatch
          </h1>
          <p className="text-muted-foreground">
            Discover events that match your vibe
          </p>
        </header>

        <Button
          className="w-full shadow-glow"
          onClick={getAISuggestions}
          disabled={suggestionsLoading || events.length === 0}
        >
          <Sparkles className="mr-2 h-4 w-4" />
          {suggestionsLoading ? "Generating..." : "Get AI Suggestions"}
        </Button>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Suggested For You</h2>
          {loading ? (
            <p className="text-muted-foreground">Loading events...</p>
          ) : events.length === 0 ? (
            <p className="text-muted-foreground">No events available yet</p>
          ) : (
            <div className="grid gap-4">
              {events.map((event) => (
                <EventCard
                  key={event.id}
                  id={event.id}
                  title={event.title}
                  description={event.description || undefined}
                  eventDate={event.event_date}
                  venue={event.venue || undefined}
                  location={event.location || undefined}
                  imageUrl={event.image_url || undefined}
                  tags={event.tags || undefined}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      <ChatBot />
      <BottomNav />
    </div>
  );
};

export default Home;
