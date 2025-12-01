// components/ui/sheets/delete-account-sheet.tsx
import React from "react";
import { View, Text } from "react-native";
import { Button } from "~/components/ui/button";
import { BottomSheetModal } from "./filter-bottom-sheet"; // adjust path if needed
import Icon from "../icon";

type Props = {
  visible: boolean;
  onClose: () => void;
  onConfirmDelete: () => void; // This will trigger actual deletion
  isDeleting?: boolean; // Optional: show loading state
};

export const DeleteAccountSheet = ({
  visible,
  onClose,
  onConfirmDelete,
  isDeleting = false,
}: Props) => {
  return (
    <BottomSheetModal
      visible={visible}
      onClose={onClose}
      title="Delete Account"
      heightMode="half"
      footer={
        <View className="flex-row justify-between px-1 gap-4 pb-8">
          <Button
            variant="outline"
            text="Cancel"
            onPress={onClose}
            className="flex-1 rounded-xl text-center"
            disabled={isDeleting}
          />
          <Button
            variant="destructive"
            text={isDeleting ? "Deleting..." : "Delete Account"}
            onPress={onConfirmDelete}
            className="flex-1 rounded-xl text-center"
            loading={isDeleting}
            disabled={isDeleting}
          />
        </View>
      }
    >
      <View className="px-6">
        <View className="items-center mb-6">
          <View className="w-16 h-16 bg-red-100 rounded-full items-center justify-center mb-4">
            <Icon
            name={"alert-outline"}
            size={28}
            className='text-destructive'
            />
          </View>
        </View>

        <Text className="text-center text-xl font-semibold text-foreground mb-3">
          Permanently Delete Your Account?
        </Text>

        <Text className="text-center text-muted-foreground text-base leading-6">
          This action{" "}
          <Text className="font-semibold text-destructive">
            cannot be undone
          </Text>
          . All your data, events, preferences, and account will be permanently
          removed.
        </Text>

        <Text className="text-center text-sm text-destructive font-medium mt-4">
          You will not be able to recover your account.
        </Text>
      </View>
    </BottomSheetModal>
  );
};
