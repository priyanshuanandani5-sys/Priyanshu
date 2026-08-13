"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

async function assertAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in.");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") throw new Error("Not authorized.");

  return supabase;
}

export async function markOrderPaid(formData: FormData) {
  const supabase = await assertAdmin();
  const orderId = String(formData.get("orderId"));
  const upiRef = String(formData.get("upiRef") ?? "").trim();

  await supabase
    .from("orders")
    .update({ status: "paid", paid_at: new Date().toISOString(), upi_ref: upiRef || null })
    .eq("id", orderId);

  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin/orders");
  revalidatePath("/admin");
}

export async function updateOrderStatus(formData: FormData) {
  const supabase = await assertAdmin();
  const orderId = String(formData.get("orderId"));
  const status = String(formData.get("status"));

  await supabase.from("orders").update({ status }).eq("id", orderId);

  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin/orders");
  revalidatePath("/admin");
}
