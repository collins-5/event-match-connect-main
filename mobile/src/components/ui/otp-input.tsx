// src/components/ui/otp-input.tsx
import { useRef, useEffect } from "react";
import { TextInput, View } from "react-native";

interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
}

const OTPInput = ({ length = 6, value, onChange }: OTPInputProps) => {
  const inputRefs = useRef<TextInput[]>([]);

  useEffect(() => {
    if (value.length === length) {
      inputRefs.current[length - 1]?.blur();
    }
  }, [value, length]);

  const handleChange = (text: string, index: number) => {
    const newValue = value.split("");
    newValue[index] = text;
    const updated = newValue.join("").replace(/[^0-9]/g, "");
    onChange(updated.slice(0, length));

    if (text && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = ({ nativeEvent }: any, index: number) => {
    if (nativeEvent.key === "Backspace" && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <View className="flex-row justify-between px-8">
      {Array.from({ length }).map((_, index) => (
        <TextInput
          key={index}
          ref={(ref) => ref && (inputRefs.current[index] = ref)}
          className="h-14 w-12 rounded-xl border border-border bg-card text-center text-xl font-semibold text-foreground"
          keyboardType="number-pad"
          maxLength={1}
          value={value[index] || ""}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          selectTextOnFocus
          caretHidden
        />
      ))}
    </View>
  );
};

export default OTPInput;
