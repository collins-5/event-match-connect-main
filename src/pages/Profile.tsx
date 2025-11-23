import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { LogOut, MapPin, User as UserIcon } from "lucide-react";
import { toast } from "sonner";

interface Profile {
  full_name: string | null;
  location: string | null;
  age: number | null;
  bio: string | null;
}

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [interests, setInterests] = useState<string[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        loadProfile(session.user.id);
        loadInterests(session.user.id);
      }
    });
  }, [navigate]);

  const loadProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error: any) {
      console.error("Failed to load profile:", error);
    }
  };

  const loadInterests = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("user_interests")
        .select("interest")
        .eq("user_id", userId);

      if (error) throw error;
      setInterests(data?.map((i) => i.interest) || []);
    } catch (error: any) {
      console.error("Failed to load interests:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Signed out successfully");
      navigate("/auth");
    } catch (error: any) {
      toast.error("Failed to sign out");
    }
  };

  if (!user) return null;

  const initials = profile?.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || user.email?.[0].toUpperCase();

  return (
    <div className="min-h-screen bg-gradient-hero pb-20">
      <div className="max-w-screen-xl mx-auto p-4 space-y-6">
        <header className="pt-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Profile</h1>
          <Button variant="ghost" size="icon" onClick={handleSignOut}>
            <LogOut className="h-5 w-5" />
          </Button>
        </header>

        <Card className="shadow-elevated">
          <CardContent className="pt-6 space-y-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="bg-gradient-primary text-2xl text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">{profile?.full_name || "User"}</h2>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
            </div>

            {profile?.location && (
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{profile.location}</span>
                {profile.age && <span>• {profile.age} years old</span>}
              </div>
            )}

            {profile?.bio && (
              <p className="text-center text-muted-foreground">{profile.bio}</p>
            )}

            {interests.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {interests.map((interest) => (
                    <Badge key={interest} variant="secondary">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <Button variant="outline" className="w-full" onClick={() => navigate("/onboarding")}>
              Edit Profile
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default Profile;