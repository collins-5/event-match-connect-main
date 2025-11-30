import React, { ReactNode } from "react";
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface SafeAreaWrapperProps {
  children: ReactNode;
  style?: object | undefined |null;
  edges?: Array<"top" | "right" | "bottom" | "left">;
  backgroundColor?: string;
}

const SafeAreaWrapper: React.FC<SafeAreaWrapperProps> = ({
  children,
  style,
  edges = [ "right", "bottom", "left"],
  backgroundColor = "#ffffff",
}) => {
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <SafeAreaView edges={edges} style={styles.safeArea} >
        <View style={[styles.content, style]}>{children}</View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});

export default SafeAreaWrapper;
