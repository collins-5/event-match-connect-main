import "react-native-url-polyfill/auto";
import "react-native-get-random-values";

import { Platform } from "react-native";
import { createClient } from "@supabase/supabase-js";

import type { Database } from "../../src/integrations/supabase/types";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase environment variables are missing. Check mobile/.env.");
}

let supabase: any = null;

if (Platform.OS !== "web") {
  const AsyncStorage = require("@react-native-async-storage/async-storage").default;

  supabase = createClient<Database>(supabaseUrl ?? "", supabaseAnonKey ?? "", {
    auth: {
      storage: AsyncStorage,
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false
    }
  });
} else {
  // For web, use a simpler configuration without AsyncStorage
  supabase = createClient<Database>(supabaseUrl ?? "", supabaseAnonKey ?? "", {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false
    }
  });
}

export { supabase };

