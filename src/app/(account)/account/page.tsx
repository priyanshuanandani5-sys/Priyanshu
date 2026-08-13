import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";

export default async function AccountOverviewPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user!.id)
    .single();

  const { count: orderCount } = await supabase
    .from("orders")
    .select("id", { count: "exact", head: true });

  return (
    <div>
      <h1 className="font-display text-3xl text-cocoa-900">
        {profile?.full_name ? `Hi, ${profile.full_name.split(" ")[0]}` : "Your account"}
      </h1>
      <p className="mt-2 text-cocoa-700">{user?.email}</p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <div className="rounded-md border border-clay-200 bg-[#fffcf6] p-6 shadow-[0_2px_12px_rgba(74,46,35,0.08)]">
          <p className="font-display text-lg text-cocoa-900">Orders</p>
          <p className="mt-1 text-sm text-cocoa-700">
            {orderCount ?? 0} order{orderCount === 1 ? "" : "s"} placed
          </p>
          <Button
            render={<Link href="/account/orders" />}
            nativeButton={false}
            variant="outline"
            size="sm"
            className="mt-4 rounded-md border-cocoa-700 text-cocoa-900 hover:bg-cream-100"
          >
            View order history
          </Button>
        </div>

        <div className="rounded-md border border-clay-200 bg-[#fffcf6] p-6 shadow-[0_2px_12px_rgba(74,46,35,0.08)]">
          <p className="font-display text-lg text-cocoa-900">Addresses</p>
          <p className="mt-1 text-sm text-cocoa-700">
            Manage saved delivery addresses
          </p>
          <Button
            render={<Link href="/account/addresses" />}
            nativeButton={false}
            variant="outline"
            size="sm"
            className="mt-4 rounded-md border-cocoa-700 text-cocoa-900 hover:bg-cream-100"
          >
            Manage addresses
          </Button>
        </div>
      </div>
    </div>
  );
}
