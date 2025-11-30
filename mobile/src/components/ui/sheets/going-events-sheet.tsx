// src/components/sheets/GoingEventsSheet.tsx
import { useRouter } from "expo-router";
import { Image, TouchableOpacity, View, Text } from "react-native";
import Icon from "@/components/ui/icon";
import { BottomSheetModal } from "./filter-bottom-sheet";

type Event = {
  id: string;
  title: string;
  event_date: string;
  image_url: string | null;
};

type Props = {
  visible: boolean;
  events: Event[];
  userName?: string | null;
  onClose: () => void;
};

export default function GoingEventsSheet({
  visible,
  events,
  userName,
  onClose,
}: Props) {
  const router = useRouter();

  return (
    <BottomSheetModal
      visible={visible}
      title={`Events ${userName ? userName.split(" ")[0] + " is" : ""} Going To`}
      subtitle={
        events.length === 0
          ? "No events yet"
          : `${events.length} event${events.length > 1 ? "s" : ""}`
      }
      showCloseButton={true}
      heightMode="full"
      showDragHandle={true}
      onClose={onClose}
    >
      {events.length === 0 ? (
        <View className="items-center py-20">
          <Icon name="calendar-remove" size={48} color="#666" />
          <Text className="text-muted-foreground text-base mt-4">
            No events yet
          </Text>
        </View>
      ) : (
        <View className="gap-4 pb-6">
          {events.map((event) => (
            <TouchableOpacity
              key={event.id}
              className="bg-card border border-muted rounded-2xl overflow-hidden flex-row active:opacity-70"
              onPress={() => {
                onClose();
                router.push(`/event/${event.id}`);
              }}
            >
              {event.image_url ? (
                <Image
                  source={{ uri: event.image_url }}
                  className="w-28 h-28"
                  resizeMode="cover"
                />
              ) : (
                <View className="w-28 h-28 bg-primary/10 items-center justify-center">
                  <Icon name="calendar" size={36} color="rgb(4, 116, 56)" />
                </View>
              )}

              <View className="flex-1 p-4 justify-center">
                <Text
                  className="text-foreground font-semibold text-base"
                  numberOfLines={2}
                >
                  {event.title}
                </Text>
                <Text className="text-muted-foreground text-sm mt-1">
                  {new Date(event.event_date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </BottomSheetModal>
  );
}
