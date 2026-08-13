import { createClient } from "@/lib/supabase/server";
import { FlavorsManager } from "@/components/admin/flavors-manager";

export default async function AdminFlavorsPage() {
  const supabase = await createClient();
  const { data: flavors } = await supabase
    .from("flavors")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div>
      <h1 className="font-display text-3xl text-cocoa-900">Flavors</h1>
      <p className="mt-1 text-sm text-cocoa-700">
        Photo uploads will be added once ImageKit is connected — flavors show
        as color placeholders on the site until then.
      </p>
      <div className="mt-6">
        <FlavorsManager flavors={flavors ?? []} />
      </div>
    </div>
  );
}
