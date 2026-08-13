"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const navLinks = [
  { href: "/flavors", label: "Flavors" },
  { href: "/build-a-box", label: "Build a Box" },
  { href: "/about", label: "Our Story" },
];

export function MobileNav({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <button
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="text-cocoa-700 md:hidden"
      >
        <Menu className="h-6 w-6" strokeWidth={1.75} />
      </button>
      <SheetContent side="right" className="bg-cream-50">
        <SheetHeader>
          <SheetTitle className="font-display text-xl text-cocoa-900">
            Bite Sized Cookies
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 px-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-3 text-base text-cocoa-800 hover:bg-cream-100"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={isLoggedIn ? "/account" : "/login"}
            onClick={() => setOpen(false)}
            className="rounded-md px-2 py-3 text-base text-cocoa-800 hover:bg-cream-100"
          >
            {isLoggedIn ? "Account" : "Sign in"}
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
