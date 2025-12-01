import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from '~/components/ui/button';
import Icon from '~/components/ui/icon';
import { Skeleton } from '~/components/ui/skeleton';
import { Text } from '~/components/ui/text';

const ProfileAccountSettingsSkeleton = () => {
    return (
      <View className="px-6 py-6">
        <Text className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-5">
          Profile Information
        </Text>

        <View className="flex-row items-center bg-muted/30 rounded-xl px-4 py-4 mb-4">
          <Icon
            name="account-outline"
            size={22}
            className="text-primary mr-3"
          />
          <View className="flex-1">
            <Text className="text-sm text-muted-foreground">Full Name</Text>
            <Skeleton className="h-5 w-32 mt-1 rounded-md" />
          </View>
        </View>

        <View className="flex-row items-center bg-muted/30 rounded-xl px-4 py-4 mb-4">
          <Icon name="email-outline" size={22} className="text-primary mr-3" />
          <View className="flex-1">
            <Text className="text-sm text-muted-foreground">Email Address</Text>
            <Skeleton className="h-5 w-48 mt-1 rounded-md" />
          </View>
        </View>

        <View className="flex-row items-center bg-muted/30 rounded-xl px-4 py-4 mb-6">
          <Icon name="phone-outline" size={22} className="text-primary mr-3" />
          <View className="flex-1">
            <Text className="text-sm text-muted-foreground">Phone Number</Text>
            <Skeleton className="h-5 w-40 mt-1 rounded-md" />
          </View>
        </View>

        <View className="absolute right-0">
          <Button
            text="edit"
            variant="ghost"
            className="text-primary"
            leftIcon={
              <Icon name={"account-edit"} className="text-primary" size={28} />
            }
            />
        </View>
      </View>
    );
}

const styles = StyleSheet.create({})

export default ProfileAccountSettingsSkeleton;
