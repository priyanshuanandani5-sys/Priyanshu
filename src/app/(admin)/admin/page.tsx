import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [{ count: pendingCount }, { count: paidCount }, { count: preparingCount }] =
    await Promise.all([
      supabase
        .from("orders")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending_payment"),
      supabase
        .from("orders")
        .select("id", { count: "exact", head: true })
        .eq("status", "paid"),
      supabase
        .from("orders")
        .select("id", { count: "exact", head: true })
        .in("status", ["preparing", "ready_for_pickup", "out_for_delivery"]),
    ]);

  const cards = [
    {
      label: "Awaiting payment",
      value: pendingCount ?? 0,
      href: "/admin/orders?status=pending_payment",
    },
    {
      label: "Paid, not yet started",
      value: paidCount ?? 0,
      href: "/admin/orders?status=paid",
    },
    {
      label: "In progress",
      value: preparingCount ?? 0,
      href: "/admin/orders",
    },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl text-cocoa-900">Dashboard</h1>

      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-md border border-clay-200 bg-[#fffcf6] p-6 shadow-[0_2px_12px_rgba(74,46,35,0.08)] transition-colors hover:border-pink-500"
          >
            <p className="font-display text-4xl text-cocoa-900">{card.value}</p>
            <p className="mt-1 text-sm text-cocoa-700">{card.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
