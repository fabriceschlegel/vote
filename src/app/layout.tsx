import type { Metadata } from "next";
import Link from "next/link";
import { Fraunces, Manrope } from "next/font/google";

import { siteDescription, siteTitle } from "@/lib/winchester-data";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: `${siteTitle} | Winchester candidate records`,
    template: `%s | ${siteTitle}`,
  },
  description: siteDescription,
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${manrope.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <div className="min-h-full bg-[linear-gradient(180deg,_rgba(255,255,255,0.92)_0%,_rgba(255,255,255,0.35)_18%,_rgba(255,255,255,0)_34%),var(--background)]">
          <div className="border-b border-[#8f102a] bg-[#7a0019] text-white">
            <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-2 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-10">
              <p className="text-center text-[0.6rem] font-semibold uppercase tracking-[0.2em] lg:text-left sm:text-[0.68rem] sm:tracking-[0.24em]">
                Independent community project. Not developed by the Town of
                Winchester or Winchester Public Schools.
              </p>
              <div className="flex items-center justify-center gap-2 text-xs font-semibold sm:text-sm">
                <Link
                  href="/"
                  className="inline-flex items-center rounded-full border border-white/18 px-3 py-1.5 transition hover:border-white/38 hover:bg-white/8"
                >
                  Home
                </Link>
                <Link
                  href="/sources"
                  className="inline-flex items-center rounded-full bg-white px-3 py-1.5 text-[#7a0019] transition hover:bg-[#fbf1d6]"
                >
                  Sources
                </Link>
              </div>
            </div>
          </div>

          {children}

          <footer className="border-t border-[#e5ddd3] bg-white">
            <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-4 text-sm text-black/48 lg:flex-row lg:items-center lg:justify-between lg:px-10">
              <p className="font-display text-lg text-[#201712]">{siteTitle}</p>
              <div className="flex flex-wrap items-center gap-4">
                <Link href="/" className="transition hover:text-[#8f102a]">
                  Home
                </Link>
                <Link href="/sources" className="transition hover:text-[#8f102a]">
                  Sources
                </Link>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
