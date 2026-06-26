import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { CartProvider } from "@/components/providers/cart-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Rempah Indonesia - Authentic Spices",
    template: "%s | Rempah Indonesia",
  },
  description:
    "Rempah Indonesia brings you the finest authentic Indonesian spices, herbs, and seasonings. Direct from farms in the archipelago to your kitchen.",
  keywords: [
    "Indonesian spices",
    "authentic spices",
    "rempah",
    "Indonesia",
    "herbs",
    "seasoning",
  ],
  authors: [{ name: "Rempah Indonesia" }],
  openGraph: {
    title: "Rempah Indonesia - Authentic Spices",
    description:
      "Your trusted source for authentic Indonesian spices and herbs.",
    type: "website",
    locale: "id_ID",
    siteName: "Rempah Indonesia",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider>
          <CartProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
