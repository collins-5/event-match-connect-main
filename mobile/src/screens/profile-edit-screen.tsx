// app/(tabs)/profile/edit.tsx  (or wherever you prefer)
import { useEffect, useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import Icon from "@/components/ui/icon";
import { supabase } from "@/lib/supabase";
import { useSession } from "@/hooks/useSession";

const INTEREST_OPTIONS = [
  { name: "Music", icon: "microphone" },
  { name: "Sports", icon: "arm-flex" },
  { name: "Art", icon: "image" },
  { name: "Food", icon: "food-apple" },
  { name: "Technology", icon: "access-point" },
  { name: "Gaming", icon: "view-module" },
  { name: "Fitness", icon: "arm-flex" },
  { name: "Travel", icon: "earth" },
  { name: "Photography", icon: "camera" },
  { name: "Reading", icon: "clipboard-text" },
  { name: "Movies", icon: "video-outline" },
  { name: "Dancing", icon: "account-group" },
];

export default function ProfileEditScreen() {
  const router = useRouter();
  const { user } = useSession();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [age, setAge] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [interests, setInterests] = useState<string[]>([]);

  useEffect(() => {
    if (user) loadProfile();
  }, [user]);

  const loadProfile = async () => {
    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("full_name, bio, location, age, avatar_url")
        .eq("id", user?.id)
        .single();

      if (error) throw error;

      setFullName(profile.full_name || "");
      setBio(profile.bio || "");
      setLocation(profile.location || "");
      setAge(profile.age ? profile.age.toString() : "");
      setAvatarUrl(profile.avatar_url);

      // Load interests
      const { data: interestsData } = await supabase
        .from("user_interests")
        .select("interest")
        .eq("user_id", user?.id);

      setInterests(interestsData?.map((i: any) => i.interest) || []);
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSaving(true);
      const file = result.assets[0];
      const fileExt = file.uri.split(".").pop();
      const fileName = `${user?.id}-${Date.now()}.${fileExt}`;

      const { error: uploadError, data } = await supabase.storage
        .from("avatars")
        .upload(
          fileName,
          {
            uri: file.uri,
            type: file.mimeType || "image/jpeg",
            name: fileName,
          } as any,
          { upsert: true }
        );

      if (uploadError) {
        Alert.alert("Upload failed", uploadError.message);
        setSaving(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);
      const publicUrl = urlData.publicUrl;

      await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", user?.id);
      setAvatarUrl(publicUrl);
      setSaving(false);
    }
  };

  const toggleInterest = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSave = async () => {
    if (!fullName.trim()) {
      Alert.alert("Required", "Full name is required");
      return;
    }

    setSaving(true);
    try {
      // Update profile
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          full_name: fullName.trim(),
          bio: bio.trim() || null,
          location: location.trim() || null,
          age: age ? parseInt(age) : null,
          avatar_url: avatarUrl,
        })
        .eq("id", user?.id);

      if (profileError) throw profileError;

      // Sync interests: delete old, insert new
      await supabase.from("user_interests").delete().eq("user_id", user?.id);

      if (interests.length > 0) {
        const inserts = interests.map((i) => ({
          user_id: user?.id,
          interest: i,
        }));
        const { error: intError } = await supabase
          .from("user_interests")
          .insert(inserts);
        if (intError) throw intError;
      }

      Alert.alert("Success", "Profile updated!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-background justify-center items-center">
        <ActivityIndicator size="large" color="rgb(4, 116, 56)" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="px-6 py-8">
        {/* Avatar */}
        <View className="items-center mb-8">
          <TouchableOpacity onPress={pickImage} disabled={saving}>
            <View className="relative">
              {avatarUrl ? (
                <Image
                  source={{ uri: avatarUrl }}
                  className="w-32 h-32 rounded-full"
                />
              ) : (
                <View className="w-32 h-32 rounded-full bg-primary/20 justify-center items-center">
                  <Icon name="account" size={48} color="rgb(4, 116, 56)" />
                </View>
              )}
              <View className="absolute bottom-0 right-0 bg-primary rounded-full p-3 border-4 border-background">
                <Icon name="pencil" size={20} color="white" />
              </View>
            </View>
          </TouchableOpacity>
          <Text className="text-muted-foreground text-sm mt-3">
            Tap to change photo
          </Text>
        </View>

        {/* Form */}
        <View className="gap-5 mb-6">
          <View>
            <Text className="text-muted-foreground text-sm font-semibold mb-2">
              Full Name
            </Text>
            <TextInput
              className="bg-card border border-muted rounded-2xl px-4 py-4 text-foreground"
              value={fullName}
              onChangeText={setFullName}
              placeholder="John Doe"
            />
          </View>

          <View>
            <Text className="text-muted-foreground text-sm font-semibold mb-2">
              Bio
            </Text>
            <TextInput
              className="bg-card border border-muted rounded-2xl px-4 py-4 text-foreground"
              value={bio}
              onChangeText={setBio}
              placeholder="Tell us about yourself..."
              multiline
              numberOfLines={4}
            />
          </View>

          <View className="flex-row gap-4">
            <View className="flex-1">
              <Text className="text-muted-foreground text-sm font-semibold mb-2">
                Location
              </Text>
              <TextInput
                className="bg-card border border-muted rounded-2xl px-4 py-4 text-foreground"
                value={location}
                onChangeText={setLocation}
                placeholder="City, Country"
              />
            </View>
            <View className="flex-1">
              <Text className="text-muted-foreground text-sm font-semibold mb-2">
                Age
              </Text>
              <TextInput
                className="bg-card border border-muted rounded-2xl px-4 py-4 text-foreground"
                value={age}
                onChangeText={setAge}
                placeholder="25"
                keyboardType="number-pad"
              />
            </View>
          </View>

          {/* Interests */}
          <View>
            <Text className="text-muted-foreground text-sm font-semibold mb-3">
              Interests
            </Text>
            <View className="flex-row flex-wrap gap-3">
              {INTEREST_OPTIONS.map((item) => (
                <TouchableOpacity
                  key={item.name}
                  onPress={() => toggleInterest(item.name)}
                  className={`rounded-2xl px-4 py-3 flex-row items-center gap-2 border-2 ${
                    interests.includes(item.name)
                      ? "bg-primary border-primary"
                      : "bg-card border-muted"
                  }`}
                >
                  <Icon
                    name={item.icon}
                    size={18}
                    color={
                      interests.includes(item.name)
                        ? "white"
                        : "rgb(4, 116, 56)"
                    }
                  />
                  <Text
                    className={`font-semibold text-sm ${
                      interests.includes(item.name)
                        ? "text-white"
                        : "text-foreground"
                    }`}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Buttons */}
        <View className="flex-row gap-4">
          <TouchableOpacity
            className="flex-1 bg-card border-2 border-muted py-4 rounded-2xl items-center"
            onPress={() => router.back()}
            disabled={saving}
          >
            <Text className="font-semibold text-muted-foreground">Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 bg-primary py-4 rounded-2xl items-center opacity-100"
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-bold">Save Changes</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
