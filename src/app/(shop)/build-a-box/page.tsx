import { getAvailableFlavors } from "@/lib/data/flavors";
import { getActiveBoxSize } from "@/lib/data/box-sizes";
import { getEffectivePrice } from "@/lib/pricing/get-effective-price";
import { BoxBuilder } from "@/components/shop/box-builder";

export default async function BuildABoxPage() {
  const [flavors, box] = await Promise.all([
    getAvailableFlavors(),
    getActiveBoxSize(),
  ]);

  if (!box) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="font-display text-3xl text-cocoa-900">
          Box builder is taking a short break
        </h1>
        <p className="mt-3 text-cocoa-700">
          We&apos;re between batches — check back shortly.
        </p>
      </div>
    );
  }

  const price = getEffectivePrice(box);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
      <div className="mb-10">
        <p className="text-xs uppercase tracking-[0.16em] text-pink-600">
          {box.name}
        </p>
        <h1 className="mt-2 font-display text-4xl text-cocoa-900 md:text-5xl">
          Build your box
        </h1>
        <p className="mt-3 max-w-xl text-cocoa-700">
          Pick {box.cookie_count} cookies from the flavors below — repeat a
          favorite or mix it up. Add as many boxes as you like.
        </p>
      </div>

      {flavors.length === 0 ? (
        <p className="text-cocoa-700">
          Flavors are being added — check back shortly.
        </p>
      ) : (
        <BoxBuilder box={box} flavors={flavors} price={price} />
      )}
    </div>
  );
}
