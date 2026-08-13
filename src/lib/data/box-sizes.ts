import { createClient } from "@/lib/supabase/server";
import type { BoxSize } from "@/lib/pricing/get-effective-price";

/**
 * The site launches with a single active box size. If more are added later,
 * this returns the first by sort_order — callers that need to list all
 * active sizes should query box_sizes directly instead.
 */
export async function getActiveBoxSize(): Promise<BoxSize | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("box_sizes")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data;
}
