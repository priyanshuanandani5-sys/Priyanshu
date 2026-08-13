import Link from "next/link";
import { ArrowRight, MapPin, PackageCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CookieMark } from "@/components/marketing/cookie-mark";
import { FlavorImage } from "@/components/shop/flavor-image";
import { getAvailableFlavors } from "@/lib/data/flavors";
import { getActiveBoxSize } from "@/lib/data/box-sizes";
import { getEffectivePrice, isPromoActive } from "@/lib/pricing/get-effective-price";

const steps = [
  {
    icon: Sparkles,
    title: "Pick your flavors",
    body: "Choose 4 flavors for your box — repeat a favorite or mix it up. Every cookie is baked in small batches.",
  },
  {
    icon: PackageCheck,
    title: "Pay by UPI",
    body: "Checkout with a UPI deep link or QR code. We confirm your order by hand, not by algorithm.",
  },
  {
    icon: MapPin,
    title: "Pickup or local delivery",
    body: "Grab it yourself, or we'll deliver within 2 days across Vile Parle and Juhu.",
  },
];

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  month: "short",
  day: "numeric",
  timeZone: "Asia/Kolkata",
});

export default async function HomePage() {
  const [flavors, box] = await Promise.all([
    getAvailableFlavors(),
    getActiveBoxSize(),
  ]);
  const featuredFlavors = flavors.slice(0, 4);
  const now = new Date();
  const promoActive = box ? isPromoActive(box, now) : false;
  const price = box ? getEffectivePrice(box, now) : null;

  return (
    <>
      {/* Hero */}
      <section className="border-b border-clay-200">
        <div className="mx-auto grid max-w-6xl gap-16 px-6 py-20 md:grid-cols-[1.1fr_0.9fr] md:items-center md:py-28">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-pink-600">
              Small-batch &middot; Bite-sized &middot; Made to order
            </p>
            <h1 className="mt-5 font-display text-5xl leading-[1.05] text-cocoa-900 md:text-6xl">
              Gourmet cookies,
              <br />
              built your way.
            </h1>
            <p className="mt-6 max-w-md font-body text-lg leading-relaxed text-cocoa-700">
              Pick 4 flavors, build your box, and pay by UPI. Fresh from our
              kitchen to your door in Vile Parle and Juhu &mdash; or swing by
              for pickup.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Button
                render={<Link href="/build-a-box" />}
                nativeButton={false}
                size="lg"
                className="h-12 rounded-md bg-pink-500 px-7 text-base text-cream-50 hover:bg-pink-600"
              >
                Build Your Box <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                render={<Link href="/flavors" />}
                nativeButton={false}
                variant="outline"
                size="lg"
                className="h-12 rounded-md border-cocoa-700 px-7 text-base text-cocoa-900 hover:bg-cream-100"
              >
                Explore Flavors
              </Button>
            </div>

            {box && price != null && (
              <div className="mt-10 inline-flex items-center gap-3 rounded-md border border-pink-300 bg-pink-300/20 px-4 py-3">
                <span className="font-display text-2xl text-pink-600">
                  ₹{price}
                </span>
                <span className="text-sm leading-snug text-cocoa-800">
                  {promoActive && box.promo_ends_at ? (
                    <>
                      Launch price per box of {box.cookie_count} &mdash;
                      through {dateFormatter.format(new Date(box.promo_ends_at))} only.
                      <br />₹{box.base_price} afterward.
                    </>
                  ) : (
                    <>Per box of {box.cookie_count} cookies.</>
                  )}
                </span>
              </div>
            )}
          </div>

          <div className="relative mx-auto flex h-72 w-72 items-center justify-center md:h-96 md:w-96">
            <CookieMark className="absolute inset-0 h-full w-full drop-shadow-[0_18px_30px_rgba(74,46,35,0.25)]" />
            <CookieMark className="absolute h-40 w-40 translate-x-16 translate-y-24 rotate-12 drop-shadow-[0_14px_20px_rgba(74,46,35,0.2)] md:h-52 md:w-52" />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <h2 className="font-display text-3xl text-cocoa-900 md:text-4xl">
          How it works
        </h2>
        <div className="mt-12 grid gap-10 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.title}>
              <step.icon
                className="h-7 w-7 text-pink-500"
                strokeWidth={1.5}
              />
              <h3 className="mt-4 font-display text-xl text-cocoa-900">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-cocoa-700">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured flavors */}
      <section className="border-y border-clay-200 bg-cream-100">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-3xl text-cocoa-900 md:text-4xl">
              Fan favorites
            </h2>
            <Link
              href="/flavors"
              className="text-sm uppercase tracking-[0.1em] text-pink-600 hover:text-pink-700"
            >
              See all flavors &rarr;
            </Link>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredFlavors.map((flavor) => (
              <div
                key={flavor.id}
                className="overflow-hidden rounded-md border border-clay-200 bg-[#fffcf6] shadow-[0_2px_12px_rgba(74,46,35,0.08)]"
              >
                <FlavorImage
                  name={flavor.name}
                  imagePath={flavor.image_path}
                  className="h-36 w-full"
                />
                <div className="p-4">
                  <p className="font-display text-lg text-cocoa-900">
                    {flavor.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service area */}
      <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="grid gap-10 rounded-md border border-clay-200 bg-[#fffcf6] p-10 shadow-[0_2px_12px_rgba(74,46,35,0.08)] md:grid-cols-[auto_1fr] md:items-center md:p-14">
          <MapPin
            className="h-10 w-10 text-pink-500 md:h-14 md:w-14"
            strokeWidth={1.25}
          />
          <div>
            <h2 className="font-display text-2xl text-cocoa-900 md:text-3xl">
              Currently baking for Vile Parle &amp; Juhu
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-cocoa-700">
              Choose self-pickup anytime, or local delivery fulfilled within
              2 days of your order. More neighborhoods coming soon.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
