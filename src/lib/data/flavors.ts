import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/types/database.types";

export type Flavor = Tables<"flavors">;

export async function getAvailableFlavors(): Promise<Flavor[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("flavors")
    .select("*")
    .eq("is_available", true)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data;
}
