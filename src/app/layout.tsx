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
          <div className="border-b border-[#8f102a] bg-[#7a0019] px-4 py-2 text-center text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white sm:px-6">
            Independent community project. Not developed by the Town of
            Winchester or Winchester Public Schools.
          </div>
          <header className="border-b border-[#d9d1c6] bg-white text-[#201712]">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 lg:px-10">
              <div>
                <Link href="/" className="inline-flex items-center gap-3">
                  <span className="font-display text-[2.1rem] tracking-[-0.05em]">
                    {siteTitle}
                  </span>
                  <span className="rounded-full border border-[#d8c49b] bg-[#fbf1d6] px-3 py-1 text-[0.66rem] font-semibold uppercase tracking-[0.22em] text-[#8f102a]">
                    Winchester voter guide
                  </span>
                </Link>
              </div>

              <nav className="flex flex-wrap items-center gap-3 text-sm font-semibold text-black/68">
                <Link
                  href="/"
                  className="inline-flex items-center rounded-full border border-[#d8d1c7] bg-white px-4 py-2 transition hover:border-[#8f102a]/35 hover:text-[#8f102a]"
                >
                  Home
                </Link>
                <Link
                  href="/sources"
                  className="inline-flex items-center rounded-full bg-[#8f102a] px-4 py-2 text-white transition hover:bg-[#6f0f27]"
                >
                  Sources
                </Link>
              </nav>
            </div>
            <div className="h-1 bg-[linear-gradient(90deg,_#8f102a_0%,_#c8475d_55%,_#e2b653_100%)]" />
          </header>

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
