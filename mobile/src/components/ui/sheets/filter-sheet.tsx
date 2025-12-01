// src/components/ui/sheets/filter-sheet.tsx
import React from "react";
import { View } from "react-native";
import { Button } from "~/components/ui/button";
import { BottomSheetModal } from "./filter-bottom-sheet";
import { InterestTag } from "~/components/core/interest";
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
] as const;

type Props = {
  visible: boolean;
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
  clearTags?: () => void;
  onClose: () => void;
};

export const FilterBottomSheet = ({
  visible,
  selectedTags,
  onToggleTag,
  clearTags,
  onClose,
}: Props) => {
  const hasTags = selectedTags.length > 0;

  return (
    <BottomSheetModal
      visible={visible}
      title="Filter by Interests"
      subtitle={hasTags ? `${selectedTags.length} selected` : undefined}
      heightMode="half"
      onClose={onClose}
      footer={
        <View className="flex-row justify-between px-6 pb-1">
          <Button
            text={hasTags ? "Save Filters" : "No filters selected"}
            onPress={onClose}
            disabled={!hasTags}
            className={`flex-1 mr-3 rounded-xl text-center ${hasTags ? "bg-primary" : "bg-muted"}`}
          />
          {hasTags && (
            <Button
              variant="destructive"
              text="Clear All"
              onPress={clearTags}
              className="flex-1 rounded-xl text-center"
            />
          )}
        </View>
      }
    >
      <View className="flex-row flex-wrap gap-3 px-6 pb-6">
        {INTEREST_OPTIONS.map((interest) => {
          const selected = selectedTags.includes(interest);

          return (
            <InterestTag
              key={interest}
              name={interest}
              selected={selected}
              onPress={() => onToggleTag(interest)}
              size="sm"
            />
          );
        })}
      </View>
    </BottomSheetModal>
  );
};
