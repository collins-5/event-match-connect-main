import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Calendar, MapPin, Users } from "lucide-react";
import { format } from "date-fns";
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

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [isGoing, setIsGoing] = useState(false);
  const [attendeeCount, setAttendeeCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadEvent();
      loadAttendanceStatus();
      loadAttendeeCount();
    }
  }, [id]);

  const loadEvent = async () => {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setEvent(data);
    } catch (error: any) {
      toast.error("Failed to load event");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const loadAttendanceStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("event_attendees")
      .select("*")
      .eq("event_id", id)
      .eq("user_id", user.id)
      .eq("status", "going")
      .maybeSingle();

    setIsGoing(!!data);
  };

  const loadAttendeeCount = async () => {
    const { count } = await supabase
      .from("event_attendees")
      .select("*", { count: "exact", head: true })
      .eq("event_id", id)
      .eq("status", "going");

    setAttendeeCount(count || 0);
  };

  const toggleAttendance = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }

    try {
      if (isGoing) {
        await supabase
          .from("event_attendees")
          .delete()
          .eq("event_id", id)
          .eq("user_id", user.id);
        setIsGoing(false);
        setAttendeeCount((prev) => prev - 1);
        toast.success("Removed from your events");
      } else {
        await supabase
          .from("event_attendees")
          .insert({ event_id: id, user_id: user.id, status: "going" });
        setIsGoing(true);
        setAttendeeCount((prev) => prev + 1);
        toast.success("Added to your events!");
      }
    } catch (error: any) {
      toast.error("Failed to update attendance");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!event) return null;

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-10 bg-background/80 backdrop-blur-sm"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>

      {event.image_url && (
        <div className="relative h-64 overflow-hidden">
          <img
            src={event.image_url}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </div>
      )}

      <div className="max-w-screen-xl mx-auto p-4 space-y-6 -mt-8 relative z-10">
        <Card className="shadow-elevated">
          <CardContent className="pt-6 space-y-6">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold">{event.title}</h1>
              
              {event.tags && event.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="space-y-3 text-muted-foreground">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5" />
                  <span>{format(new Date(event.event_date), "PPPp")}</span>
                </div>
                {(event.venue || event.location) && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5" />
                    <span>{event.venue || event.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5" />
                  <span>{attendeeCount} going</span>
                </div>
              </div>

              {event.description && (
                <div className="pt-4 border-t">
                  <h3 className="font-semibold mb-2">About this event</h3>
                  <p className="text-muted-foreground">{event.description}</p>
                </div>
              )}
            </div>

            <Button
              onClick={toggleAttendance}
              className="w-full"
              variant={isGoing ? "outline" : "default"}
            >
              {isGoing ? "Not Going" : "I'm Going!"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EventDetails;