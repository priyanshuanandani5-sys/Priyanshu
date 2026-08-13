import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-clay-200 bg-cocoa-900 text-cream-100">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-3">
        <div>
          <p className="font-display text-xl text-cream-50">
            Bite Sized Cookies
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-cream-100/70">
            Small-batch gourmet cookies, baked fresh and boxed by hand.
            Currently serving Vile Parle &amp; Juhu.
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.12em] text-caramel-400">
            Shop
          </p>
          <ul className="mt-4 space-y-3 text-sm text-cream-100/80">
            <li>
              <Link href="/build-a-box" className="hover:text-cream-50">
                Build a Box
              </Link>
            </li>
            <li>
              <Link href="/flavors" className="hover:text-cream-50">
                Flavors
              </Link>
            </li>
            <li>
              <Link href="/account/orders" className="hover:text-cream-50">
                Track an Order
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.12em] text-caramel-400">
            Delivery Area
          </p>
          <p className="mt-4 text-sm leading-relaxed text-cream-100/80">
            Self-pickup available daily. Local delivery to Vile Parle and
            Juhu, fulfilled within 2 days of your order.
          </p>
        </div>
      </div>

      <div className="border-t border-cream-50/10 px-6 py-6 text-center text-xs text-cream-100/50">
        © {new Date().getFullYear()} Bite Sized Cookies. All rights reserved.
      </div>
    </footer>
  );
}
