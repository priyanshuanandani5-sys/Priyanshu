"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ActionState = { error: string | null; success?: boolean };

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function upsertFlavor(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();
  const flavorId = formData.get("flavorId");
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const sortOrder = Number(formData.get("sortOrder") ?? 0);

  if (!name) return { error: "Name is required." };

  const row = {
    name,
    slug: slugify(name),
    description: description || null,
    sort_order: Number.isFinite(sortOrder) ? sortOrder : 0,
  };

  const { error } = flavorId
    ? await supabase.from("flavors").update(row).eq("id", String(flavorId))
    : await supabase.from("flavors").insert({ ...row, is_available: true });

  if (error) return { error: error.message };

  revalidatePath("/admin/flavors");
  revalidatePath("/flavors");
  revalidatePath("/build-a-box");
  revalidatePath("/");
  return { error: null, success: true };
}

export async function toggleFlavorAvailability(formData: FormData) {
  const supabase = await createClient();
  const flavorId = String(formData.get("flavorId"));
  const isAvailable = formData.get("isAvailable") === "true";

  await supabase
    .from("flavors")
    .update({ is_available: !isAvailable })
    .eq("id", flavorId);

  revalidatePath("/admin/flavors");
  revalidatePath("/flavors");
  revalidatePath("/build-a-box");
  revalidatePath("/");
}

export async function deleteFlavor(formData: FormData) {
  const supabase = await createClient();
  const flavorId = String(formData.get("flavorId"));
  await supabase.from("flavors").delete().eq("id", flavorId);

  revalidatePath("/admin/flavors");
  revalidatePath("/flavors");
  revalidatePath("/build-a-box");
  revalidatePath("/");
}

export async function updateBoxSize(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();
  const boxSizeId = String(formData.get("boxSizeId"));
  const basePrice = Number(formData.get("basePrice"));
  const promoPrice = formData.get("promoPrice");
  const promoStartsAt = formData.get("promoStartsAt");
  const promoEndsAt = formData.get("promoEndsAt");

  if (!Number.isFinite(basePrice) || basePrice < 0) {
    return { error: "Enter a valid base price." };
  }

  const { error } = await supabase
    .from("box_sizes")
    .update({
      base_price: basePrice,
      promo_price: promoPrice ? Number(promoPrice) : null,
      promo_starts_at: promoStartsAt ? new Date(String(promoStartsAt)).toISOString() : null,
      promo_ends_at: promoEndsAt ? new Date(String(promoEndsAt)).toISOString() : null,
    })
    .eq("id", boxSizeId);

  if (error) return { error: error.message };

  revalidatePath("/admin/box-sizes");
  revalidatePath("/build-a-box");
  revalidatePath("/");
  return { error: null, success: true };
}
