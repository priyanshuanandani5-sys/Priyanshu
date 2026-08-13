import type { Metadata } from "next";
import { Fraunces, Karla } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
});

const karla = Karla({
  variable: "--font-karla",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bite Sized Cookies",
  description:
    "Small-batch, bite-sized gourmet cookies. Build your own box or order local delivery in Vile Parle and Juhu.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${karla.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-body bg-cream-50 text-cocoa-900">
        {children}
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
