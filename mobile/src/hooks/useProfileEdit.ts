// hooks/useProfileEdit.ts
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "@/lib/supabase";
import { useSession } from "@/hooks/useSession";

export type ProfileFormData = {
    fullName: string;
    bio: string;
    location: string;
    age: string;
    avatarUrl: string | null;
    interests: string[];
};

export const useProfileEdit = () => {
    const { user } = useSession();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState<ProfileFormData>({
        fullName: "",
        bio: "",
        location: "",
        age: "",
        avatarUrl: null,
        interests: [],
    });

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

            setFormData({
                fullName: profile.full_name || "",
                bio: profile.bio || "",
                location: profile.location || "",
                age: profile.age ? profile.age.toString() : "",
                avatarUrl: profile.avatar_url,
                interests: [],
            });

            // Fixed: Properly type the interest row
            const { data: interestsData } = await supabase
                .from("user_interests")
                .select("interest")
                .eq("user_id", user?.id);

            const interests = interestsData?.map((item: { interest: string }) => item.interest) || [];

            setFormData(prev => ({
                ...prev,
                interests,
            }));
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

        if (!result.canceled && user) {
            setSaving(true);
            const file = result.assets[0];
            const fileExt = file.uri.split(".").pop() || "jpg";
            const fileName = `${user.id}-${Date.now()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
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

            const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(fileName);
            const publicUrl = urlData.publicUrl;

            await supabase
                .from("profiles")
                .update({ avatar_url: publicUrl })
                .eq("id", user.id);

            setFormData(prev => ({ ...prev, avatarUrl: publicUrl }));
            setSaving(false);
        }
    };

    const toggleInterest = (interest: string) => {
        setFormData(prev => ({
            ...prev,
            interests: prev.interests.includes(interest)
                ? prev.interests.filter(i => i !== interest)
                : [...prev.interests, interest],
        }));
    };

    const saveProfile = async () => {
        if (!formData.fullName.trim()) {
            Alert.alert("Required", "Full name is required");
            return;
        }

        if (!user) return;

        setSaving(true);
        try {
            const { error: profileError } = await supabase
                .from("profiles")
                .update({
                    full_name: formData.fullName.trim(),
                    bio: formData.bio.trim() || null,
                    location: formData.location.trim() || null,
                    age: formData.age ? parseInt(formData.age) || null : null,
                    avatar_url: formData.avatarUrl,
                })
                .eq("id", user.id);

            if (profileError) throw profileError;

            // Delete old interests
            await supabase.from("user_interests").delete().eq("user_id", user.id);

            // Insert new ones
            if (formData.interests.length > 0) {
                const inserts = formData.interests.map(interest => ({
                    user_id: user.id,
                    interest,
                }));
                const { error: intError } = await supabase.from("user_interests").insert(inserts);
                if (intError) throw intError;
            }

            Alert.alert("Success", "Profile updated!", [{ text: "OK" }]);
        } catch (err: any) {
            Alert.alert("Error", err.message || "Failed to save profile");
        } finally {
            setSaving(false);
        }
    };

    return {
        loading,
        saving,
        formData,
        setFormData,
        pickImage,
        toggleInterest,
        saveProfile,
    };
};