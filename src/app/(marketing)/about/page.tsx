import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CookieMark } from "@/components/marketing/cookie-mark";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20 md:py-28">
      <CookieMark className="h-16 w-16" />
      <p className="mt-8 text-xs uppercase tracking-[0.16em] text-pink-600">
        Our story
      </p>
      <h1 className="mt-3 font-display text-4xl text-cocoa-900 md:text-5xl">
        Big flavor, tiny kitchen.
      </h1>

      <div className="mt-8 space-y-5 text-lg leading-relaxed text-cocoa-700">
        <p>
          Bite Sized Cookies started with a simple thought. Why should a
          good cookie come in a giant bag with just one flavor, one that
          gets boring after the second bite? We wanted something
          different. So we bake our cookies small, in fresh little
          batches, so you can pick and choose exactly what you love. A
          bit of dark chocolate here, a touch of salted caramel there.
          Whatever you&apos;re in the mood for, we make sure your box
          feels like it was made just for you.
        </p>
        <p>
          We bake everything fresh to order. No mass production. No
          preservatives. No shortcuts. Just real butter, good chocolate,
          and a whole lot of love.
        </p>
        <p>
          Right now, we&apos;re a small neighbourhood operation, baking
          for Vile Parle and Juhu. You can pick up your order any day of
          the week, or get it delivered within two days. As we grow,
          we&apos;re excited to bring Bite Sized Cookies to more of
          Mumbai, one box at a time.
        </p>
      </div>

      <Button
        render={<Link href="/build-a-box" />}
        nativeButton={false}
        size="lg"
        className="mt-10 h-12 rounded-md bg-pink-500 px-7 text-base text-cream-50 hover:bg-pink-600"
      >
        Build Your Box <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
