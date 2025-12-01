// src/screens/ProfileScreen.tsx
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import Icon from "@/components/ui/icon";

import { useSession } from "@/hooks/useSession";
import { LogoutSheet } from "~/components/ui/sheets/logout-sheet";
import { ProfileScreenSkeleton } from "~/components/core/skeletons/profile-skeleton";
import { useProfile } from "@/hooks/useProfile";
import { InterestTag } from "~/components/core/interest";

// Import Tabs from your primitives
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useState } from "react";
import { SettingsDrawer } from "~/components/ui/sheets/settings-drawer";

export const ProfileScreen = () => {
  const router = useRouter();
  const { user } = useSession();
  const [settingsOpen, setSettingsOpen] = useState(false); // ← Add this
  const {
    profile,
    interests,
    events,
    loading,
    activeTab,
    setActiveTab, // ← this is typed as Dispatch<SetStateAction<"profile" | "going">>
    logout,
    setLogout,
    handleSignOut,
    initials,
  } = useProfile();

  if (loading) {
    return <ProfileScreenSkeleton />;
  }

  // Fix TypeScript: safely cast the value to our allowed tabs
  const handleTabChange = (value: string) => {
    if (value === "profile" || value === "going") {
      setActiveTab(value);
    }
  };

  return (
    <>
      <ScrollView
        className="flex-1 bg-background"
        showsVerticalScrollIndicator={false}
      >
        <View className="px-1 pt-6 pb-10">
          {/* Avatar & Name */}
          <View className="items-center mb-6">
            <View className="relative mb-4">
              <View className="w-24 h-24 rounded-full bg-primary/20 justify-center items-center overflow-hidden border-4 border-primary/30">
                {profile?.avatar_url ? (
                  <Image
                    source={{ uri: profile.avatar_url }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                ) : (
                  <Text className="text-primary text-3xl font-bold">
                    {initials}
                  </Text>
                )}
              </View>

              <TouchableOpacity
                className="absolute bottom-0 right-0 bg-primary rounded-full w-8 h-8 items-center justify-center border-2 border-background"
                onPress={() => router.push("/(auth)/profile-edit")}
              >
                <Icon name="account-edit" size={16} color="white" />
              </TouchableOpacity>
            </View>

            <Text className="text-foreground text-2xl font-bold mb-1">
              {profile?.full_name || "User Profile"}
            </Text>
            <Text className="text-muted-foreground text-sm">{user?.email}</Text>
          </View>

          {/* TABS */}
          <Tabs value={activeTab} onValueChange={handleTabChange} className="">
            <TabsList variant="noPills" className="mb-6">
              <TabsTrigger value="profile" className="flex-1">
                <Text className="text-sm font-semibold">Profile</Text>
              </TabsTrigger>
              <TabsTrigger value="going" className="flex-1">
                <Text className="text-sm font-semibold">
                  Going{" "}
                  <Text className="text-foreground font-bold">
                    ({events.length})
                  </Text>
                </Text>
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="w-11/12">
              {/* Stats */}
              <View className="flex-row gap-1 mb-6">
                <TouchableOpacity
                  className="flex-1 bg-card border border-muted rounded-2xl p-4 items-center"
                  onPress={() => router.push("/my-events")}
                >
                  <Icon
                    name="calendar-clock"
                    size={24}
                    color="rgb(4, 116, 56)"
                  />
                  <Text className="text-foreground text-2xl font-bold mt-2">
                    {events.length}
                  </Text>
                  <Text className="text-muted-foreground text-xs">
                    Events Going
                  </Text>
                </TouchableOpacity>

                <View className="flex-1 bg-card border border-muted rounded-2xl p-4 items-center">
                  <Icon name="heart" size={24} color="rgb(4, 116, 56)" />
                  <Text className="text-foreground text-2xl font-bold mt-2">
                    {interests.length}
                  </Text>
                  <Text className="text-muted-foreground text-xs">
                    Interests
                  </Text>
                </View>
              </View>

              {/* Bio */}
              {profile?.bio && (
                <View className="bg-card border border-muted rounded-2xl p-5 mb-4">
                  <View className="flex-row items-center gap-2 mb-3">
                    <Icon
                      name="clipboard-text"
                      size={18}
                      color="rgb(4, 116, 56)"
                    />
                    <Text className="text-muted-foreground uppercase text-xs font-semibold tracking-wider">
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
                {profile?.location && (
                  <View className="bg-card border border-muted rounded-2xl p-4">
                    <View className="flex-row items-center gap-3">
                      <View className="bg-primary/20 w-10 h-10 rounded-xl items-center justify-center">
                        <Icon
                          name="map-marker-radius-outline"
                          size={20}
                          color="rgb(4, 116, 56)"
                        />
                      </View>
                      <View className="flex-1">
                        <Text className="text-muted-foreground text-xs font-medium uppercase tracking-wider mb-1">
                          Location
                        </Text>
                        <Text className="text-foreground text-base font-semibold">
                          {profile.location}
                        </Text>
                      </View>
                    </View>
                  </View>
                )}

                {profile?.age && (
                  <View className="bg-card border border-muted rounded-2xl p-4">
                    <View className="flex-row items-center gap-3">
                      <View className="bg-primary/20 w-10 h-10 rounded-xl items-center justify-center">
                        <Icon
                          name="calendar"
                          size={20}
                          color="rgb(4, 116, 56)"
                        />
                      </View>
                      <View className="flex-1">
                        <Text className="text-muted-foreground text-xs font-medium uppercase tracking-wider mb-1">
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
                <View className="bg-card border border-muted rounded-2xl p-5 mb-6">
                  <View className="flex-row items-center gap-2 mb-4">
                    <Icon name="heart" size={18} color="rgb(4, 116, 56)" />
                    <Text className="text-muted-foreground uppercase text-xs font-semibold tracking-wider">
                      Interests
                    </Text>
                  </View>
                  <View className="flex-row flex-wrap gap-2">
                    {interests.map((interest) => (
                      <InterestTag
                        key={interest}
                        name={interest}
                        selected={true}
                        size="md"
                      />
                    ))}
                  </View>
                </View>
              )}

              {/* Sign Out */}
              <TouchableOpacity
                className="bg-destructive/10 border-2 border-destructive/30 rounded-2xl p-4 items-center"
                onPress={() => setLogout(true)}
              >
                <View className="flex-row items-center gap-2">
                  <Icon
                    name="account-switch-outline"
                    size={20}
                    color="rgb(239, 68, 68)"
                  />
                  <Text className="text-destructive text-base font-bold">
                    Sign Out
                  </Text>
                </View>
              </TouchableOpacity>
            </TabsContent>

            {/* Going Tab */}
            <TabsContent value="going" className="w-11/12">
              {events.length === 0 ? (
                <View className="items-center justify-center py-16 gap-4">
                  <View className="bg-muted/50 w-20 h-20 rounded-full items-center justify-center">
                    <Icon
                      name="calendar"
                      size={40}
                      color="rgb(105, 105, 105)"
                    />
                  </View>
                  <Text className="text-foreground text-lg font-semibold">
                    No events yet
                  </Text>
                  <Text className="text-muted-foreground text-sm text-center px-8">
                    Explore events and mark them as going to see them here!
                  </Text>
                  <TouchableOpacity
                    className="bg-primary rounded-full px-6 py-3 mt-2"
                    onPress={() => router.push("/(tabs)")}
                  >
                    <Text className="text-primary-foreground font-semibold">
                      Explore Events
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View className="gap-3 pb-6">
                  {events.map((event) => (
                    <TouchableOpacity
                      key={event.id}
                      className="bg-card border border-muted rounded-2xl overflow-hidden"
                      onPress={() => router.push(`/event/${event.id}`)}
                    >
                      <View className="flex-row">
                        {event.image_url ? (
                          <Image
                            source={{ uri: event.image_url }}
                            className="w-28 h-28"
                            resizeMode="cover"
                          />
                        ) : (
                          <View className="w-28 h-28 bg-primary/10 items-center justify-center">
                            <Icon
                              name="calendar"
                              size={32}
                              color="rgb(4, 116, 56)"
                            />
                          </View>
                        )}
                        <View className="flex-1 p-4 justify-between">
                          <View>
                            <Text
                              className="text-foreground text-base font-bold mb-1"
                              numberOfLines={2}
                            >
                              {event.title}
                            </Text>
                            <View className="flex-row items-center gap-1 mb-1">
                              <Icon
                                name="calendar-clock"
                                size={14}
                                color="rgb(105, 105, 105)"
                              />
                              <Text className="text-muted-foreground text-xs">
                                {new Date(event.event_date).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                  }
                                )}
                              </Text>
                            </View>
                            {(event.venue || event.location) && (
                              <View className="flex-row items-center gap-1">
                                <Icon
                                  name="map-marker-radius-outline"
                                  size={14}
                                  color="rgb(105, 105, 105)"
                                />
                                <Text
                                  className="text-muted-foreground text-xs"
                                  numberOfLines={1}
                                >
                                  {event.venue || event.location}
                                </Text>
                              </View>
                            )}
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </TabsContent>
          </Tabs>
        </View>
      </ScrollView>

      <LogoutSheet
        visible={logout}
        onClose={() => setLogout(false)}
        handleSignOut={handleSignOut}
      />
    </>
  );
};
