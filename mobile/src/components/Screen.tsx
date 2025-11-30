import type { ReactNode } from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";

type ScreenProps = {
  children: ReactNode;
  scrollable?: boolean;
};

export const Screen = ({ children, scrollable = true }: ScreenProps) => {
  if (scrollable) {
    return (
      <SafeAreaView className="flex-1 bg-muted">
        <ScrollView 
          contentContainerStyle={styles.content}
          className="flex-grow"
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView className="flex-1 bg-muted">
      <View className="flex-grow px-4 py-3 gap-3">{children}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12
  }
});

