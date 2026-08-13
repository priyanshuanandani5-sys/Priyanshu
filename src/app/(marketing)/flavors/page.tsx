import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getAvailableFlavors } from "@/lib/data/flavors";
import { FlavorImage } from "@/components/shop/flavor-image";
import { Button } from "@/components/ui/button";

export default async function FlavorsPage() {
  const flavors = await getAvailableFlavors();

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <div className="flex flex-wrap items-end justify-between gap-6 border-b border-clay-200 pb-8">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-pink-600">
            The full lineup
          </p>
          <h1 className="mt-3 font-display text-4xl text-cocoa-900 md:text-5xl">
            Every flavor, baked small-batch.
          </h1>
        </div>
        <Button
          render={<Link href="/build-a-box" />}
          nativeButton={false}
          size="lg"
          className="h-11 rounded-md bg-pink-500 px-6 text-cream-50 hover:bg-pink-600"
        >
          Build Your Box <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      {flavors.length === 0 ? (
        <p className="mt-12 text-cocoa-700">
          Flavors are being added — check back shortly.
        </p>
      ) : (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {flavors.map((flavor) => (
            <div
              key={flavor.id}
              className="overflow-hidden rounded-md border border-clay-200 bg-[#fffcf6] shadow-[0_2px_12px_rgba(74,46,35,0.08)]"
            >
              <FlavorImage
                name={flavor.name}
                imagePath={flavor.image_path}
                className="h-40 w-full"
              />
              <div className="p-5">
                <p className="font-display text-lg text-cocoa-900">
                  {flavor.name}
                </p>
                {flavor.description && (
                  <p className="mt-1.5 text-sm leading-relaxed text-cocoa-700">
                    {flavor.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
