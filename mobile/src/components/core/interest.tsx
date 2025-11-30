// src/components/ui/interest-tag.tsx
import React from "react";
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { Text } from '@/components/ui/text';
import Icon from '@/components/ui/icon';
import { cn } from '@/lib/utils';
import View from "../ui/view";

const INTEREST_ICONS: Record<string, any> = {
  Music: 'music',
  Sports: 'basketball',
  Art: 'brush',
  Food: 'food',
  Technology: 'laptop',
  Gaming: 'gamepad-variant',
  Fitness: 'arm-flex',
  Travel: 'airplane',
  Photography: 'camera',
  Reading: 'book-open-variant',
  Movies: 'filmstrip',
  Dancing: 'dance-pole',
  Nature: 'pine-tree',
  Fashion: 'hanger',
  Cooking: 'chef-hat',
  Writing: 'pencil',
  Yoga: 'yoga',
  Hiking: 'terrain',
  Pets: 'paw',
  Books: 'library',
  Theater: 'drama-masks',
} as const;

type InterestName = keyof typeof INTEREST_ICONS;

type InterestTagProps = {
  name: InterestName | string;
  selected?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onPress?: () => void;
  disabled?: boolean;
} & Omit<TouchableOpacityProps, 'onPress'>;

const sizeStyles = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2.5 text-sm gap-2',
  lg: 'px-5 py-3 text-base gap-2.5',
};

export const InterestTag = React.memo(
  ({
    name,
    selected = false,
    size = 'md',
    onPress,
    disabled = false,
    className,
    ...props
  }: InterestTagProps) => 
    {
    const iconName = INTEREST_ICONS[name as InterestName] ?? 'star'; // fallback

    const Wrapper = onPress ? TouchableOpacity : View;

    return (
      <Wrapper
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.7}
        className={cn(
          'flex-row items-center rounded-2xl border-2',
          sizeStyles[size],
          selected
            ? 'bg-primary border-primary'
            : 'bg-card border-muted',
          disabled && 'opacity-60',
          onPress && 'hover:opacity-90',
          className
        )}
        {...props}
      >
        <Icon
          name={iconName}
          size={size === 'sm' ? 14 : size === 'md' ? 18 : 22}
          className={selected ? 'text-primary-foreground' : 'text-[#047438]'}
        />
        <Text
          className={cn(
            'font-medium',
            selected ? 'text-primary-foreground' : 'text-foreground'
          )}
        >
          {name}
        </Text>
      </Wrapper>
    );
  }
);

InterestTag.displayName = 'InterestTag';