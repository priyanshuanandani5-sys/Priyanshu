"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/lib/actions/auth";

const links = [
  { href: "/account", label: "Overview" },
  { href: "/account/orders", label: "Orders" },
  { href: "/account/addresses", label: "Addresses" },
  { href: "/account/settings", label: "Settings" },
];

export function AccountNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-row gap-2 overflow-x-auto md:flex-col md:gap-1">
      {links.map((link) => {
        const active =
          link.href === "/account"
            ? pathname === "/account"
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
      <form action={signOut} className="mt-2 md:mt-4">
        <button className="whitespace-nowrap rounded-md px-3 py-2 text-sm text-cocoa-700/70 transition-colors hover:bg-cream-100 hover:text-alert-500">
          Sign out
        </button>
      </form>
    </nav>
  );
}
