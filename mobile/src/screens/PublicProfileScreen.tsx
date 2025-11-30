// app/profile/PublicProfileScreen.tsx  (or keep in src/screens/ – works either way!)
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Pressable,
} from "react-native";
import { Screen } from "@/components/Screen";
import Icon from "@/components/ui/icon";
import { ProfileScreenSkeleton } from "~/components/core/skeletons/profile-skeleton";
import { usePublicProfile } from "@/hooks/usePublicProfile";
import GoingEventsSheet from "~/components/ui/sheets/going-events-sheet";
import { InterestTag } from "~/components/core/interest";

export default function PublicProfileScreen() {
  const router = useRouter();
  const { profile, interests, events, loading, initials } = usePublicProfile();

  const [sheetVisible, setSheetVisible] = useState(false);
  if (loading) return <ProfileScreenSkeleton />;

  if (!profile) {
    return (
      <Screen>
        <Text className="text-foreground text-lg">User not found</Text>
      </Screen>
    );
  }

  return (
    <>
      {/* Main Profile Screen */}
      <View className="flex-1 bg-muted px-4 pt-6">
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="px-6 pt-6 pb-10">
            {/* Back Button */}
            <TouchableOpacity
              onPress={() => router.back()}
              className="absolute top-14 left-6 z-10 bg-background/80 backdrop-blur rounded-full p-2 border border-muted"
            >
              <Icon name="arrow-left" size={24} color="#047438" />
            </TouchableOpacity>

            {/* Avatar + Name */}
            <View className="items-center mb-6 mt-10">
              <View className="w-28 h-28 rounded-full bg-primary/20 justify-center items-center overflow-hidden border-4 border-primary/30">
                {profile.avatar_url ? (
                  <Image
                    source={{ uri: profile.avatar_url }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                ) : (
                  <Text className="text-primary text-4xl font-bold">
                    {initials}
                  </Text>
                )}
              </View>
              <Text className="text-foreground text-3xl font-bold mt-4">
                {profile.full_name}
              </Text>
            </View>

            {/* Stats Row */}
            <View className="flex-row gap-3 mb-6">
              {/* Clickable: Events Going → Opens Modal */}
              <TouchableOpacity
                onPress={() => setSheetVisible(true)}
                className="flex-1 bg-card border border-muted rounded-2xl p-4 items-center active:opacity-70"
              >
                <Icon name="calendar-clock" size={24} color="rgb(4, 116, 56)" />
                <Text className="text-foreground text-2xl font-bold mt-2">
                  {events.length}
                </Text>
                <Text className="text-muted-foreground text-xs">
                  Events Going
                </Text>
              </TouchableOpacity>

              {/* Interests */}
              <View className="flex-1 bg-card border border-muted rounded-2xl p-4 items-center">
                <Icon name="heart" size={24} color="rgb(4, 116, 56)" />
                <Text className="text-foreground text-2xl font-bold mt-2">
                  {interests.length}
                </Text>
                <Text className="text-muted-foreground text-xs">Interests</Text>
              </View>
            </View>

            {/* Bio, Location, Age, Interests – unchanged */}
            {profile.bio && (
              <View className="bg-card border border-muted rounded-2xl p-5 mb-4">
                <View className="flex-row items-center gap-2 mb-3">
                  <Icon
                    name="clipboard-text"
                    size={18}
                    color="rgb(4, 116, 56)"
                  />
                  <Text className="text-muted-foreground uppercase text-xs font-semibold tracking-wide">
                    About Me
                  </Text>
                </View>
                <Text className="text-foreground text-base leading-6">
                  {profile.bio}
                </Text>
              </View>
            )}

            {/* Location & Age */}
            <View className="gap-3 mb-4">
              {profile.location && (
                <View className="bg-card border border-muted rounded-2xl p-4">
                  <View className="flex-row items-center gap-3">
                    <View className="bg-primary/20 w-10 h-10 rounded-xl items-center justify-center">
                      <Icon
                        name="map-marker-radius-outline"
                        size={20}
                        color="rgb(4, 116, 56)"
                      />
                    </View>
                    <View>
                      <Text className="text-muted-foreground text-xs font-medium uppercase tracking-wide mb-1">
                        Location
                      </Text>
                      <Text className="text-foreground text-base font-semibold">
                        {profile.location}
                      </Text>
                    </View>
                  </View>
                </View>
              )}

              {profile.age && (
                <View className="bg-card border border-muted rounded-2xl p-4">
                  <View className="flex-row items-center gap-3">
                    <View className="bg-primary/20 w-10 h-10 rounded-xl items-center justify-center">
                      <Icon name="calendar" size={20} color="rgb(4, 116, 56)" />
                    </View>
                    <View>
                      <Text className="text-muted-foreground text-xs font-medium uppercase tracking-wide mb-1">
                        Age
                      </Text>
                      <Text className="text-foreground text-base font-semibold">
                        {profile.age} years old
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            </View>

            {/* Interests */}
            {interests.length > 0 && (
              <View className="bg-card border border-muted rounded-2xl p-5">
                <View className="flex-row items-center gap-2 mb-3">
                  <Icon name="heart" size={18} color="rgb(4, 116, 56)" />
                  <Text className="text-muted-foreground uppercase text-xs font-semibold tracking-wide">
                    Interests
                  </Text>
                </View>
                <View className="flex-row flex-wrap gap-2">
                  {interests.map((interest) => (
                    <InterestTag    xX      
                      key={interest}
                      name={interest}
                      selected={true} // always highlighted on profile
                      size="md"
                    />
                  ))}
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </View>

      <GoingEventsSheet
        visible={sheetVisible}
        events={events}
        userName={profile.full_name}
        onClose={() => setSheetVisible(false)}
      />
    </>
  );
}
