import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSupabase } from "@/lib/db.server";

export interface Activity {
  id: string;
  title: string;
  description: string;
  location: string;
  datetime: string;
  slots: number;
  filled: number;
  anon: boolean;
  category: string;
  categoryEmoji: string;
  tags: string[];
  hostPhone: string;
  hostName: string;
  hostAvatar: string;
  stripe: "primary" | "secondary" | "tertiary";
  createdAt: string;
}

function mapRowToActivity(row: Record<string, unknown>): Activity {
  return {
    id: row.id as string,
    title: row.title as string,
    description: row.description as string,
    location: row.location as string,
    datetime: row.datetime as string,
    slots: row.slots as number,
    filled: row.filled as number,
    anon: row.anon as boolean,
    category: row.category as string,
    categoryEmoji: row.category_emoji as string,
    tags: row.tags as string[],
    hostPhone: row.host_phone as string,
    hostName: row.host_name as string,
    hostAvatar: row.host_avatar as string,
    stripe: row.stripe as "primary" | "secondary" | "tertiary",
    createdAt: row.created_at as string,
  };
}

const stripeCycle: ("primary" | "secondary" | "tertiary")[] = ["primary", "secondary", "tertiary"];

export const getActivities = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      city: z.string().optional(),
      category: z.string().optional(),
      page: z.number().optional(),
    }),
  )
  .handler(async ({ data }) => {
    const supabase = getSupabase();
    let query = supabase
      .from("activities")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    if (data.city) {
      query = query.ilike("location", `%${data.city}%`);
    }
    if (data.category) {
      query = query.ilike("category", data.category);
    }

    const page = data.page ?? 1;
    const limit = 10;
    const from = (page - 1) * limit;
    const { data: rows, count, error } = await query.range(from, from + limit - 1);
    if (error) throw error;
    return {
      activities: (rows ?? []).map(mapRowToActivity),
      total: count ?? 0,
    };
  });

export const getActivity = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    const { data: row, error } = await getSupabase()
      .from("activities")
      .select("*")
      .eq("id", data.id)
      .single();
    if (error || !row) return null;
    return mapRowToActivity(row);
  });

const CreateActivitySchema = z.object({
  title: z.string().min(1),
  description: z.string(),
  location: z.string().min(1),
  datetime: z.string().min(1),
  slots: z.number().min(2).max(20),
  anon: z.boolean(),
  category: z.string().min(1),
  categoryEmoji: z.string().min(1),
  tags: z.array(z.string()),
  hostPhone: z.string().min(1),
  hostName: z.string().min(1),
});

export const createActivity = createServerFn({ method: "POST" })
  .inputValidator(CreateActivitySchema)
  .handler(async ({ data }) => {
    const supabase = getSupabase();
    const { count } = await supabase
      .from("activities")
      .select("*", { count: "exact", head: true });

    const payload = {
      title: data.title,
      description: data.description,
      location: data.location,
      datetime: data.datetime,
      slots: data.slots,
      filled: 0,
      anon: data.anon,
      category: data.category,
      category_emoji: data.categoryEmoji,
      tags: data.tags,
      host_phone: data.hostPhone,
      host_name: data.hostName,
      host_avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.hostName)}`,
      stripe: stripeCycle[(count ?? 0) % stripeCycle.length],
    };

    const { data: row, error } = await supabase
      .from("activities")
      .insert(payload)
      .select()
      .single();

    if (error) throw error;
    return mapRowToActivity(row);
  });

export const joinActivity = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      activityId: z.string(),
      phone: z.string().min(1),
    }),
  )
  .handler(async ({ data }) => {
    const supabase = getSupabase();

    const { data: act } = await supabase
      .from("activities")
      .select("slots,filled")
      .eq("id", data.activityId)
      .single();

    if (!act || act.filled >= act.slots) throw new Error("No spots left");

    await supabase.from("activity_joins").upsert(
      { activity_id: data.activityId, phone: data.phone },
      { onConflict: "activity_id,phone" },
    );

    const { data: updated } = await supabase
      .from("activities")
      .update({ filled: act.filled + 1 })
      .eq("id", data.activityId)
      .select("slots,filled")
      .single();

    return {
      ok: true,
      spotsLeft: (updated?.slots ?? act.slots) - (updated?.filled ?? act.filled + 1),
    };
  });

export const getMyActivities = createServerFn({ method: "POST" })
  .inputValidator(z.object({ phone: z.string().min(1) }))
  .handler(async ({ data }) => {
    const supabase = getSupabase();

    const { data: hosting } = await supabase
      .from("activities")
      .select("*")
      .eq("host_phone", data.phone);

    const { data: joinRows } = await supabase
      .from("activity_joins")
      .select("activity_id")
      .eq("phone", data.phone);

    const joinedIds = (joinRows ?? []).map((r) => r.activity_id);
    let joined: Record<string, unknown>[] = [];
    if (joinedIds.length > 0) {
      const { data: j } = await supabase
        .from("activities")
        .select("*")
        .in("id", joinedIds);
      joined = j ?? [];
    }

    return {
      hosting: (hosting ?? []).map(mapRowToActivity),
      joined: joined.map(mapRowToActivity),
    };
  });
