// components/FilterBottomSheet.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Button } from "~/components/ui/button";
import { BottomSheetModal } from "./filter-bottom-sheet";

type Props = {
  visible: boolean;
  onClose: () => void;
  handleSignOut: () => void;
};

export const LogoutSheet = ({ visible, onClose, handleSignOut }: Props) => {
  return (
    <BottomSheetModal
      onClose={onClose}
      visible={visible}
      title="logout"
      heightMode="quarter"
      footer={
        <View className="flex-row justify-between px-1 gap-4 pb-8">
          <Button
            variant="outline"
            text="Cancel"
            onPress={onClose}
            className={`flex-1 mr-3 rounded-xl text-center`}
          />
          <Button
            variant="destructive"
            text="Logout"
            onPress={handleSignOut}
            className={`flex-1 mr-3 rounded-xl text-center`}
          />
        </View>
      }
    >
      <View>
        <Text className="text-center text-xl text-foreground mb-4">
          Are you sure you want to logout?
        </Text>
      </View>
    </BottomSheetModal>
  );
};
