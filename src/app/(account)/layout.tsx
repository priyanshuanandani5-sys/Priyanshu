import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { AccountNav } from "@/components/account/account-nav";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-cream-50">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 md:grid-cols-[200px_1fr] md:py-16">
          <AccountNav />
          <div className="min-w-0">{children}</div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
