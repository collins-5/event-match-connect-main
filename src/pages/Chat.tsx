import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import BottomNav from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle } from "lucide-react";

const Chat = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });
  }, [navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-hero pb-20">
      <div className="max-w-screen-xl mx-auto p-4 space-y-6">
        <header className="pt-4">
          <h1 className="text-3xl font-bold mb-2">Messages</h1>
          <p className="text-muted-foreground">Connect with other event-goers</p>
        </header>

        <div className="flex flex-col items-center justify-center py-16 space-y-4">
          <MessageCircle className="h-16 w-16 text-muted-foreground" />
          <p className="text-muted-foreground text-center">
            No conversations yet<br />
            Start connecting with people at events!
          </p>
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default Chat;