/**
 * @file Environment variable validation (backend)
 * @description Validates all required server-side env vars using zod.
 *              Call validateEnv() after dotenv.config() at server startup.
 * @service Configuration (startup guard)
 */
import { z } from "zod";

const envSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, "SUPABASE_SERVICE_ROLE_KEY is required"),
  FCM_WEBPUSH_PRIVATE_KEY: z.string().min(1, "FCM_WEBPUSH_PRIVATE_KEY is required"),
  TIWOLI_SID: z.string().min(1, "TIWOLI_SID is required"),
  TIWOLI_TOKEN: z.string().min(1, "TIWOLI_TOKEN is required"),
  GOOGLE_MAP_API: z.string().min(1, "GOOGLE_MAP_API is required"),
});

export function validateEnv() {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error("❌ Missing or invalid environment variables:");
    for (const issue of result.error.issues) {
      console.error(`   - ${issue.path.join(".")}: ${issue.message}`);
    }
    console.error("Ensure all required vars are set in secret/.env");
    process.exit(1);
  }

  return result.data;
}
