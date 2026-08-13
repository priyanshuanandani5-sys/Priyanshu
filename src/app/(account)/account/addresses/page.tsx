import { createClient } from "@/lib/supabase/server";
import { AddressesManager } from "@/components/account/addresses-manager";

export default async function AddressesPage() {
  const supabase = await createClient();
  const { data: addresses } = await supabase
    .from("addresses")
    .select("*")
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-display text-3xl text-cocoa-900">Addresses</h1>
      <div className="mt-6">
        <AddressesManager addresses={addresses ?? []} />
      </div>
    </div>
  );
}
