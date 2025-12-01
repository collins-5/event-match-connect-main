import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-actions-sheet';
import Icon from '~/components/ui/icon';
import { Skeleton } from '~/components/ui/skeleton';

const ProfileEditScreenSkeleton = () => {
    return (
      <ScrollView
        className="flex-1 bg-background"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View className="px-6 py-8">
          {/* Avatar Skeleton */}
          <View className="items-center mb-10">
            <View className="relative">
              <Skeleton className="w-32 h-32 rounded-full" />
              <View className="absolute bottom-0 right-0 bg-muted rounded-full p-3.5">
                <Icon
                  name="pencil"
                  size={22}
                  className="text-primary-forground"
                />
              </View>
            </View>
            <Skeleton className="h-4 w-32 mt-4 rounded-md" />
          </View>

          {/* Form Fields Skeleton */}
          <View className="gap-6">
            {/* Full Name */}
            <View>
              <Skeleton className="h-4 w-24 mb-2 rounded-md" />
              <Skeleton className="h-12 rounded-2xl" />
            </View>

            {/* Bio */}
            <View>
              <Skeleton className="h-4 w-16 mb-2 rounded-md" />
              <Skeleton className="h-32 rounded-2xl" />
            </View>

            {/* Location + Age Row */}
            <View className="flex-row gap-4">
              <View className="flex-1">
                <Skeleton className="h-4 w-20 mb-2 rounded-md" />
                <Skeleton className="h-12 rounded-2xl" />
              </View>
              <View className="flex-1">
                <Skeleton className="h-4 w-12 mb-2 rounded-md" />
                <Skeleton className="h-12 rounded-2xl" />
              </View>
            </View>

            {/* Interests Title */}
            <View>
              <Skeleton className="h-5 w-24 mb-4 rounded-md" />
              <View className="flex-row flex-wrap gap-3">
                {[...Array(8)].map((_, i) => (
                  <Skeleton key={i} className="h-11 w-28 rounded-2xl" />
                ))}
              </View>
            </View>
          </View>

          {/* Buttons Skeleton */}
          <View className="flex-row gap-4 mt-10">
            <Skeleton className="flex-1 h-14 rounded-2xl" />
            <Skeleton className="flex-1 h-14 rounded-2xl" />
          </View>
        </View>
      </ScrollView>
    );
}

const styles = StyleSheet.create({})

export default ProfileEditScreenSkeleton;
