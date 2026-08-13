"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { areaForPincode } from "@/lib/validation/pincode-allowlist";
import { newAddressSchema } from "@/lib/validation/schemas";

export type ActionState = { error: string | null; success?: boolean };

export async function updateProfile(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const fullName = String(formData.get("fullName") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in." };

  const { error } = await supabase
    .from("profiles")
    .update({ full_name: fullName || null, phone: phone || null })
    .eq("id", user.id);
  if (error) return { error: error.message };

  revalidatePath("/account");
  return { error: null, success: true };
}

export async function upsertAddress(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in." };

  const parsed = newAddressSchema.safeParse({
    label: formData.get("label") || undefined,
    line1: formData.get("line1"),
    line2: formData.get("line2") || undefined,
    pincode: formData.get("pincode"),
    contactName: formData.get("contactName"),
    contactPhone: formData.get("contactPhone"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid address." };
  }

  const area = areaForPincode(parsed.data.pincode);
  if (!area) {
    return { error: "Sorry, we don't currently deliver to that pincode." };
  }

  const addressId = formData.get("addressId");
  const row = {
    user_id: user.id,
    label: parsed.data.label || null,
    line1: parsed.data.line1,
    line2: parsed.data.line2 || null,
    area,
    pincode: parsed.data.pincode,
    contact_name: parsed.data.contactName,
    contact_phone: parsed.data.contactPhone,
  };

  const { error } = addressId
    ? await supabase.from("addresses").update(row).eq("id", String(addressId))
    : await supabase.from("addresses").insert(row);
  if (error) return { error: error.message };

  revalidatePath("/account/addresses");
  return { error: null, success: true };
}

export async function deleteAddress(formData: FormData) {
  const supabase = await createClient();
  const id = String(formData.get("addressId"));
  await supabase.from("addresses").delete().eq("id", id);
  revalidatePath("/account/addresses");
}

export async function setDefaultAddress(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const id = String(formData.get("addressId"));
  await supabase.from("addresses").update({ is_default: false }).eq("user_id", user.id);
  await supabase.from("addresses").update({ is_default: true }).eq("id", id);
  revalidatePath("/account/addresses");
}
