import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import BottomNav from "@/components/BottomNav";
import EventCard from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Search, Filter, X } from "lucide-react";
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

const INTEREST_OPTIONS = [
  "Music", "Sports", "Art", "Food", "Technology", "Gaming",
  "Fitness", "Travel", "Photography", "Reading", "Movies", "Dancing"
];

const Events = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate("/auth");
      else loadEvents();
    });
  }, [navigate]);

  useEffect(() => {
    filterEvents();
  }, [events, searchQuery, selectedTags]);

  const loadEvents = async () => {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("event_date", { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error: any) {
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = () => {
    let filtered = events;

    if (searchQuery) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter((event) =>
        event.tags?.some((tag) => selectedTags.includes(tag))
      );
    }

    setFilteredEvents(filtered);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  console.log("📱 Events Render State:", {
    loading,
    totalEvents: events.length,
    filteredEventsCount: filteredEvents.length,
    searchQuery,
    selectedTagsCount: selectedTags.length,
  }); 

  return (
    <div className="min-h-screen bg-gradient-hero pb-20">
      <div className="max-w-screen-xl mx-auto p-4 space-y-6">
        <header className="pt-4">
          <h1 className="text-3xl font-bold mb-4">Discover Events</h1>
          
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[60vh]">
                <SheetHeader>
                  <SheetTitle>Filter by Interests</SheetTitle>
                </SheetHeader>
                <div className="mt-6 flex flex-wrap gap-2">
                  {INTEREST_OPTIONS.map((tag) => (
                    <Badge
                      key={tag}
                      variant={selectedTags.includes(tag) ? "default" : "outline"}
                      className="cursor-pointer px-4 py-2 text-sm"
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                      {selectedTags.includes(tag) && <X className="ml-2 h-3 w-3" />}
                    </Badge>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {selectedTags.map((tag) => (
                <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => toggleTag(tag)}>
                  {tag}
                  <X className="ml-2 h-3 w-3" />
                </Badge>
              ))}
            </div>
          )}
        </header>

        <section className="space-y-4">
          {loading ? (
            <p className="text-muted-foreground">Loading events...</p>
          ) : filteredEvents.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No events found matching your criteria
            </p>
          ) : (
            <div className="grid gap-4">
              {filteredEvents.map((event) => (
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
      
      <BottomNav />
    </div>
  );
};

export default Events;