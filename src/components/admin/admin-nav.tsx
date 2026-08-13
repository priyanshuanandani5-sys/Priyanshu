"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/lib/actions/auth";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/flavors", label: "Flavors" },
  { href: "/admin/box-sizes", label: "Box Sizes" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-row gap-2 overflow-x-auto md:flex-col md:gap-1">
      <Link href="/" className="mb-4 hidden font-display text-lg text-cocoa-900 md:block">
        Bite Sized Cookies
      </Link>
      <p className="mb-1 hidden text-xs uppercase tracking-[0.12em] text-cocoa-700/60 md:block">
        Admin
      </p>
      {links.map((link) => {
        const active =
          link.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`whitespace-nowrap rounded-md px-3 py-2 text-sm transition-colors ${
              active
                ? "bg-pink-500/10 text-pink-600 font-medium"
                : "text-cocoa-700 hover:bg-cream-100"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
      <Link
        href="/"
        className="whitespace-nowrap rounded-md px-3 py-2 text-sm text-cocoa-700/70 hover:bg-cream-100"
      >
        ← Back to site
      </Link>
      <form action={signOut}>
        <button className="whitespace-nowrap rounded-md px-3 py-2 text-sm text-cocoa-700/70 transition-colors hover:bg-cream-100 hover:text-alert-500">
          Sign out
        </button>
      </form>
    </nav>
  );
}
