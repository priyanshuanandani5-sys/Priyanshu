import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getEffectivePrice } from "@/lib/pricing/get-effective-price";
import { areaForPincode } from "@/lib/validation/pincode-allowlist";
import { createOrderSchema } from "@/lib/validation/schemas";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Sign in to check out." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = createOrderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid order." },
      { status: 400 }
    );
  }
  const { boxes, fulfillmentType, addressId, newAddress, notes } = parsed.data;

  // Re-fetch box sizes and flavors server-side — never trust client prices.
  const boxSizeIds = [...new Set(boxes.map((b) => b.boxSizeId))];
  const { data: boxSizes, error: boxSizesError } = await supabase
    .from("box_sizes")
    .select("*")
    .in("id", boxSizeIds)
    .eq("is_active", true);
  if (boxSizesError) {
    return NextResponse.json({ error: "Could not verify box pricing." }, { status: 500 });
  }
  if (!boxSizes || boxSizes.length !== boxSizeIds.length) {
    return NextResponse.json(
      { error: "One of the boxes in your cart is no longer available." },
      { status: 400 }
    );
  }
  const boxSizeById = new Map(boxSizes.map((b) => [b.id, b]));

  const flavorIds = [
    ...new Set(boxes.flatMap((b) => b.flavors.map((f) => f.flavorId))),
  ];
  const { data: flavors, error: flavorsError } = await supabase
    .from("flavors")
    .select("id, is_available")
    .in("id", flavorIds);
  if (flavorsError) {
    return NextResponse.json({ error: "Could not verify flavors." }, { status: 500 });
  }
  const unavailable = flavors?.filter((f) => !f.is_available) ?? [];
  if (!flavors || flavors.length !== flavorIds.length || unavailable.length > 0) {
    return NextResponse.json(
      { error: "One of the flavors in your cart is no longer available." },
      { status: 400 }
    );
  }

  // Every box must be filled to exactly its cookie_count.
  for (const box of boxes) {
    const boxSize = boxSizeById.get(box.boxSizeId)!;
    const pickedCount = box.flavors.reduce((sum, f) => sum + f.quantity, 0);
    if (pickedCount !== boxSize.cookie_count) {
      return NextResponse.json(
        { error: `${boxSize.name} must have exactly ${boxSize.cookie_count} cookies.` },
        { status: 400 }
      );
    }
  }

  // Resolve delivery address.
  let resolvedAddressId: string | null = null;
  if (fulfillmentType === "delivery") {
    if (addressId) {
      const { data: address, error: addressError } = await supabase
        .from("addresses")
        .select("id")
        .eq("id", addressId)
        .eq("user_id", user.id)
        .maybeSingle();
      if (addressError || !address) {
        return NextResponse.json({ error: "Address not found." }, { status: 400 });
      }
      resolvedAddressId = address.id;
    } else if (newAddress) {
      const area = areaForPincode(newAddress.pincode);
      if (!area) {
        return NextResponse.json(
          { error: "Sorry, we don't currently deliver to that pincode." },
          { status: 400 }
        );
      }
      const { data: inserted, error: insertError } = await supabase
        .from("addresses")
        .insert({
          user_id: user.id,
          label: newAddress.label || null,
          line1: newAddress.line1,
          line2: newAddress.line2 || null,
          area,
          pincode: newAddress.pincode,
          contact_name: newAddress.contactName,
          contact_phone: newAddress.contactPhone,
        })
        .select("id")
        .single();
      if (insertError || !inserted) {
        return NextResponse.json({ error: "Could not save address." }, { status: 500 });
      }
      resolvedAddressId = inserted.id;
    } else {
      return NextResponse.json(
        { error: "An address is required for delivery." },
        { status: 400 }
      );
    }
  }

  const now = new Date();
  const subtotal = boxes.reduce(
    (sum, box) => sum + getEffectivePrice(boxSizeById.get(box.boxSizeId)!, now),
    0
  );

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      status: "pending_payment",
      fulfillment_type: fulfillmentType,
      address_id: resolvedAddressId,
      subtotal,
      total: subtotal,
      notes: notes || null,
    })
    .select("id")
    .single();
  if (orderError || !order) {
    return NextResponse.json({ error: "Could not create order." }, { status: 500 });
  }

  // Aggregate flavor quantities per box_size_id across all cart boxes.
  const aggregated = new Map<string, Map<string, number>>();
  for (const box of boxes) {
    const flavorMap = aggregated.get(box.boxSizeId) ?? new Map<string, number>();
    for (const f of box.flavors) {
      flavorMap.set(f.flavorId, (flavorMap.get(f.flavorId) ?? 0) + f.quantity);
    }
    aggregated.set(box.boxSizeId, flavorMap);
  }

  const orderItems = [...aggregated.entries()].flatMap(([boxSizeId, flavorMap]) => {
    const unitPrice = getEffectivePrice(boxSizeById.get(boxSizeId)!, now);
    return [...flavorMap.entries()].map(([flavorId, quantity]) => ({
      order_id: order.id,
      box_size_id: boxSizeId,
      flavor_id: flavorId,
      quantity,
      unit_price: unitPrice,
    }));
  });

  const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
  if (itemsError) {
    return NextResponse.json({ error: "Could not save order items." }, { status: 500 });
  }

  return NextResponse.json({ orderId: order.id }, { status: 201 });
}
