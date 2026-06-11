/**
 * @file Backend Supabase admin client
 * @description Uses the service_role key (server-only) for privileged operations like user management.
 * @warning NEVER expose this client or its key to the browser.
 * @service Supabase (admin operations)
 */
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    "Missing Supabase admin credentials. Ensure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in secret/.env",
  );
}

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
