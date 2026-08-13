import { createClient } from "@/lib/supabase/server";
import { BoxSizeForm } from "@/components/admin/box-size-form";

export default async function AdminBoxSizesPage() {
  const supabase = await createClient();
  const { data: boxSizes } = await supabase
    .from("box_sizes")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div>
      <h1 className="font-display text-3xl text-cocoa-900">Box Sizes</h1>
      <p className="mt-1 text-sm text-cocoa-700">
        Set regular pricing and an optional limited-time promo window.
      </p>
      <div className="mt-6 space-y-6">
        {boxSizes?.map((box) => (
          <BoxSizeForm key={box.id} box={box} />
        ))}
      </div>
    </div>
  );
}
