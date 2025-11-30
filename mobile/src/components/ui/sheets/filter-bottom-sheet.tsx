// src/components/core/filter-bottom-sheet.tsx
import React, { useEffect, useRef } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  ScrollView,
  PanResponder,
} from "react-native";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

// Define the gesture state interface
interface GestureState {
  dx: number;
  dy: number;
  vx: number;
  vy: number;
  moveX: number;
  moveY: number;
  x0: number;
  y0: number;
  numberActiveTouches: number;
  stateID: number;
}

type Props = {
  visible: boolean;
  title?: string;
  subtitle?: string;
  showCloseButton?: boolean;
  heightMode?: "half" | "full" | "three-quarter" | "quarter" | "auto";
  height?: number;
  showDragHandle?: boolean;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export const BottomSheetModal = ({
  visible,
  title,
  subtitle,
  showCloseButton = true,
  heightMode = "half",
  height,
  showDragHandle = true,
  onClose,
  children,
  footer,
}: Props) => {
  const getSheetHeight = () => {
    if (height) return height;
    if (heightMode === "full") return SCREEN_HEIGHT * 0.92;
    if (heightMode === "three-quarter") return SCREEN_HEIGHT * 0.65;
    if (heightMode === "half") return SCREEN_HEIGHT * 0.55;
    if (heightMode === "quarter") return SCREEN_HEIGHT * 0.25;

    return SCREEN_HEIGHT * 0.85;
  };

  const SHEET_HEIGHT = getSheetHeight();
  const translateY = useRef(new Animated.Value(SHEET_HEIGHT)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        damping: 30,
        stiffness: 300,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: SHEET_HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, SHEET_HEIGHT]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_: any, gesture: GestureState) => {
        if (gesture.dy > 0) {
          translateY.setValue(gesture.dy);
        }
      },
      onPanResponderRelease: (_: any, gesture: GestureState) => {
        if (gesture.dy > 120 || gesture.vy > 0.7) {
          onClose();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  if (!visible) return null;

  return (
    <Modal
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      animationType="slide"
      // presentationStyle="pageSheet"
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View className="flex-1 " />
      </TouchableWithoutFeedback>

      <Animated.View
        style={{
          transform: [{ translateY }],
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: heightMode === "auto" ? undefined : SHEET_HEIGHT,
        }}
        {...panResponder.panHandlers}
      >
        <View className="bg-background rounded-t-3xl border border-primary shadow-2xl flex-1">
          {/* Header */}
          <View className="px-6 pt-4 pb-3">
            {showDragHandle && (
              <View className="items-center mb-3">
                <View className="w-12 h-1.5 bg-primary rounded-full" />
              </View>
            )}

            {(title || showCloseButton) && (
              <View className="flex-row justify-between items-center">
                <View className="flex-1">
                  {title && (
                    <Text className="text-2xl font-bold text-foreground">
                      {title}
                    </Text>
                  )}
                  {subtitle && (
                    <Text className="text-foreground/60 text-sm mt-1">
                      {subtitle}
                    </Text>
                  )}
                </View>
                {showCloseButton && (
                  <TouchableOpacity
                    onPress={onClose}
                    className="ml-4 p-2 -mr-2"
                  >
                    <Text className="text-foreground text-3xl">×</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24 }}
          >
            {children}
          </ScrollView>

          {footer && (
            <View className="px-6 pb-8 pt-4 border-t border-white/10">
              {footer}
            </View>
          )}
        </View>
      </Animated.View>
    </Modal>
  );
};
