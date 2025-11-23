import { useSupabaseSession } from "@/providers/SupabaseSessionProvider";

export const useSession = () => {
  const ctx = useSupabaseSession();
  return ctx;
};

