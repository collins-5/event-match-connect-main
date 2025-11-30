// components/sheets/UnattendEventSheet.tsx
import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import Icon from "@/components/ui/icon";
import { BottomSheetModal } from "./filter-bottom-sheet";
import { Button } from "../button";

interface UnattendEventSheetProps {
  visible: boolean;
  isLoading: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export const UnattendEventSheet = ({
  visible,
  isLoading,
  onConfirm,
  onClose,
}: UnattendEventSheetProps) => {
  return (
    <BottomSheetModal
      visible={visible}
      title="Remove from Going?"
      subtitle="You will no longer appear as attending this event."
      heightMode="quarter"
      showDragHandle={true}
      showCloseButton={true}
      onClose={onClose}
    >
     
      <View className="flex-row justify-between px-1 gap-4 pb-8">
        <Button
          variant="outline"
          text="Cancel"
          onPress={onClose}
          className={`flex-1 mr-3 rounded-xl text-center`}
        />
        <Button
          variant="destructive"
          text=" Yes, Remove Me"
          onPress={onConfirm}
          className={`flex-1 mr-3 rounded-xl text-center`}
        />
      </View>
    </BottomSheetModal>
  );
};
