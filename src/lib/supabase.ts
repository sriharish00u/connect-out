/**
 * @file Frontend Supabase client
 * @description Creates the Supabase client instance using VITE_ env vars for browser-safe auth and DB access.
 * @service Supabase (authentication, database, storage)
 */
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase credentials. Ensure VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY are set in secret/.env",
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
