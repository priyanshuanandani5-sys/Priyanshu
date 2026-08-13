import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream-50 px-6 py-16">
      <Link
        href="/"
        className="mb-10 font-display text-2xl text-cocoa-900"
      >
        Bite Sized Cookies
      </Link>
      <div className="w-full max-w-sm rounded-md border border-clay-200 bg-[#fffcf6] p-8 shadow-[0_2px_16px_rgba(74,46,35,0.08)]">
        {children}
      </div>
    </div>
  );
}
