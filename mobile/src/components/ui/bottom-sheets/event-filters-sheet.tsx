// src/components/sheets/EventFiltersSheet.tsx

import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import ActionSheet,{ useSheet } from "react-native-actions-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";

const INTEREST_OPTIONS = [
  "Music",
  "Sports",
  "Art",
  "Food",
  "Technology",
  "Gaming",
  "Fitness",
  "Travel",
  "Photography",
  "Reading",
  "Movies",
  "Dancing",
];

const EventFiltersSheet = () => {
  const { payload, close } = useSheet(); 
  const insets = useSafeAreaInsets();

  if (!payload) return null;

  const {
    selectedTags = [],
    onToggleTag,
    onClear,
    onClose,
  } = payload as {
    selectedTags: string[];
    onToggleTag: (tag: string) => void;
    onClear: () => void;
    onClose?: () => void;
  };

  const handleClose = () => {
    onClose?.();
    close();
  };

  return (
    <ActionSheet
      id="event-filters"
      gestureEnabled
      closeOnTouchBackdrop
      containerStyle={{
        paddingBottom: insets.bottom + 20,
        paddingTop: 16,
        paddingHorizontal: 20,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
      }}
    >
      <View className="pb-6">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          <Text className="text-2xl font-bold text-foreground">
            Filter by Interests
          </Text>
          <Button variant="ghost" size="icon" onPress={handleClose}>
            <Icon name="x" size={26} className="text-muted-foreground" />
          </Button>
        </View>

        {/* Tags */}
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="flex-row flex-wrap gap-3 pb-32">
            {INTEREST_OPTIONS.map((tag) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <TouchableOpacity
                  key={tag}
                  activeOpacity={0.7}
                  onPress={() => onToggleTag(tag)}
                  className={`
                    rounded-2xl px-5 py-3 border
                    ${
                      isSelected
                        ? "bg-violet-600 border-violet-500 shadow-lg shadow-violet-900/40"
                        : "bg-card border-border"
                    }
                  `}
                >
                  <Text
                    className={`
                      font-semibold text-sm
                      ${isSelected ? "text-white" : "text-foreground"}
                    `}
                  >
                    {tag}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        {/* Clear Button */}
        {selectedTags.length > 0 && (
          <View className="absolute bottom-0 left-0 right-0 px-5 py-4 bg-background border-t border-border">
            <Button
              variant="outline"
              size="lg"
              width="full"
              onPress={() => {
                onClear();
                close();
              }}
              className="rounded-xl"
            >
              Clear All Filters ({selectedTags.length})
            </Button>
          </View>
        )}
      </View>
    </ActionSheet>
  );
};

export default EventFiltersSheet;
