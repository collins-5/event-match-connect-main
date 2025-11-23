import { Calendar, MapPin, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

interface EventCardProps {
  id: string;
  title: string;
  description?: string;
  eventDate: string;
  venue?: string;
  location?: string;
  imageUrl?: string;
  tags?: string[];
  attendeeCount?: number;
}

const EventCard = ({
  id,
  title,
  description,
  eventDate,
  venue,
  location,
  imageUrl,
  tags,
  attendeeCount,
}: EventCardProps) => {
  const navigate = useNavigate();

  return (
    <Card
      className="cursor-pointer hover:shadow-elevated transition-all duration-300 overflow-hidden"
      onClick={() => navigate(`/event/${id}`)}
    >
      {imageUrl && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          {tags && tags.length > 0 && (
            <div className="absolute top-3 left-3 flex flex-wrap gap-2">
              {tags.slice(0, 2).map((tag, index) => (
                <Badge key={index} variant="secondary" className="backdrop-blur-sm bg-background/80">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      )}
      <CardContent className="p-4 space-y-3">
        <h3 className="font-semibold text-lg line-clamp-2">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        )}
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{format(new Date(eventDate), "PPp")}</span>
          </div>
          {(venue || location) && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span className="line-clamp-1">{venue || location}</span>
            </div>
          )}
          {attendeeCount !== undefined && (
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>{attendeeCount} going</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;