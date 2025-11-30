import * as React from "react";
import * as CheckboxPrimitive from "@rn-primitives/checkbox";
import { View } from "react-native";
import { Label } from "./label";
import { Text } from "./text";
import Icon from "@/components/ui/icon";
import { cn } from "@/lib/utils";

type CheckboxProps = CheckboxPrimitive.RootProps & {
  label: string;
  id: string;
  error?: string;
  className?: string;
};

const Checkbox = React.forwardRef<CheckboxPrimitive.RootRef, CheckboxProps>(
  (
    { className, label, id, error, checked, onCheckedChange, ...props },
    ref
  ) => {
    return (
      <View className="flex flex-col gap-1">
        <View className="flex-row items-center gap-3">
          <CheckboxPrimitive.Root
            ref={ref}
            className={cn(
              "peer h-5 w-5 shrink-0 rounded-sm border border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50 web:ring-offset-background web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2",
              error && "border-destructive",
              className
            )}
            checked={checked}
            onCheckedChange={onCheckedChange}
            aria-labelledby={id}
            {...props}
          >
            <CheckboxPrimitive.Indicator className="flex h-full w-full items-center justify-center">
              <Icon name="check-bold" className="text-foreground" size={14} />
            </CheckboxPrimitive.Indicator>
          </CheckboxPrimitive.Root>

          <Label
            nativeID={id}
            className="cursor-pointer select-none"
            onPress={() => onCheckedChange?.(!checked)}
          >
            {label}
          </Label>
        </View>

        {error && <Text className="text-sm text-destructive">{error}</Text>}
      </View>
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
