import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";

import { supabase } from "@/lib/supabase";

type SessionContextValue = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
};

const SessionContext = createContext<SessionContextValue>({
  session: null,
  user: null,
  isLoading: true,
});

export const SupabaseSessionProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("🔐 SupabaseSessionProvider: Initializing...");

    // async init to safely await getSession
    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        console.log("🔐 Session retrieved:", {
          hasSession: !!data?.session,
          userId: data?.session?.user?.id,
        });
        setSession(data?.session ?? null);
      } catch (err) {
        console.error("🔐 Error retrieving session:", err);
        setSession(null);
      } finally {
        setIsLoading(false);
      }

      // Diagnostic: log possible AsyncStorage keys that might contain auth tokens
      try {
        // require here to avoid importing on web
        // @ts-ignore
        const AsyncStorage =
          require("@react-native-async-storage/async-storage").default;
        const keys = await AsyncStorage.getAllKeys();
        const supaKeys = keys.filter(
          (k: string) =>
            k.toLowerCase().includes("supabase") ||
            k.toLowerCase().includes("auth") ||
            k.toLowerCase().includes("token")
        );
        console.log("🔐 AsyncStorage keys (filtered):", supaKeys);
        for (const k of supaKeys.slice(0, 10)) {
          const v = await AsyncStorage.getItem(k);
          console.log(
            `🔐 AsyncStorage[${k}]=`,
            v ? (v.length > 120 ? v.slice(0, 120) + "..." : v) : null
          );
        }
      } catch (e) {
        console.log("🔐 AsyncStorage diagnostics failed:", String(e));
      }
    })();

    // Subscribe to auth state changes
    const { data: subData } = supabase.auth.onAuthStateChange(
      (event: any, nextSession: any) => {
        console.log("🔐 Auth state changed:", {
          event,
          hasSession: !!nextSession,
          userId: nextSession?.user?.id,
        });
        setSession(nextSession ?? null);
        setIsLoading(false);
      }
    );

    // Cleanup subscription safely
    return () => {
      try {
        // subscription object shape may vary; handle both
        // @ts-ignore
        const subscription = subData?.subscription ?? subData;
        if (subscription && typeof subscription.unsubscribe === "function") {
          subscription.unsubscribe();
        }
      } catch (e) {
        console.warn("🔐 Failed to unsubscribe auth listener:", e);
      }
    };
  }, []);

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      isLoading,
    }),
    [session, isLoading]
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
};

export const useSupabaseSession = () => useContext(SessionContext);
