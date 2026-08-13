import Link from "next/link";
import { ShoppingBag, User } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { CartBadge } from "@/components/shop/cart-badge";
import { MobileNav } from "@/components/marketing/mobile-nav";

const navLinks = [
  { href: "/flavors", label: "Flavors" },
  { href: "/build-a-box", label: "Build a Box" },
  { href: "/about", label: "Our Story" },
];

export async function SiteHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-40 border-b border-clay-200 bg-cream-50/95 backdrop-blur supports-[backdrop-filter]:bg-cream-50/80">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="font-display text-2xl tracking-tight text-cocoa-900"
        >
          Bite Sized Cookies
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-body text-sm uppercase tracking-[0.08em] text-cocoa-700 transition-colors hover:text-pink-600"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          <MobileNav isLoggedIn={!!user} />
          <Link
            href={user ? "/account" : "/login"}
            aria-label={user ? "Account" : "Sign in"}
            className="text-cocoa-700 transition-colors hover:text-pink-600"
          >
            <User className="h-5 w-5" strokeWidth={1.75} />
          </Link>
          <Link
            href="/cart"
            aria-label="Cart"
            className="relative text-cocoa-700 transition-colors hover:text-pink-600"
          >
            <ShoppingBag className="h-5 w-5" strokeWidth={1.75} />
            <CartBadge />
          </Link>
        </div>
      </div>
    </header>
  );
}
