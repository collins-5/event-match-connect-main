import { memo } from "react";
import { cn } from "@/lib/utils";
import { Pressable } from "react-native";
import { router } from "expo-router";
import { Text } from "../ui/text";
import { Input } from "../ui/input";
import { View } from "react-native";
import { Button } from "../ui/button";
import Icon from "../ui/icon";

type EventHeaderProps = {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    setShowFilters: (show: boolean) => void;
    selectedTags: string[];
};

const EventsHeaderComponent = ({
    searchQuery,
    setSearchQuery,
    setShowFilters,
    selectedTags,
  
}: EventHeaderProps) => {

  return (
    <View className="mb-1 gap-3 px-2">
      <Text className="text-2xl font-black text-primary-foreground">
        Discover Events Based on Your Interests
      </Text>

      <View className="flex-row mx-2 gap-2 items-center">
        <Input
          className="flex-2 w-10/12 rounded-lg px-2 py-2.5 text-foreground text-sm"
          placeholder="Search events..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <View className="relative mr-4">
          <Button
            variant="secondary"
            className="h-11 rounded-lg justify-center items-center"
            onPress={() => setShowFilters(true)}
            rightIcon={
              <Icon
                name="filter"
                size={24}
                className="text-primary self-center mt-4"
              />
            }
          />
        </View>
        {selectedTags.length > 0 && (
          <View className="absolute right-0 top-1 h-4 w-4 rounded-full bg-destructive"></View>
        )}
      </View>
    </View>
  );

  };

export const EventsHeader = memo(EventsHeaderComponent);
