import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import {
  Leaf,
  ShieldCheck,
  Truck,
  Award,
  Star,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Quote,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

// ─── Data fetching ──────────────────────────────────────────────

async function getFeaturedProducts() {
  const products = await prisma.product.findMany({
    where: { status: "active" },
    include: {
      category: true,
      images: { where: { isPrimary: true }, take: 1 },
    },
    orderBy: { createdAt: "desc" },
    take: 4,
  });
  return products;
}

async function getTestimonials() {
  const testimonials = await prisma.testimonial.findMany({
    orderBy: { createdAt: "desc" },
    take: 3,
  });
  return testimonials;
}

async function getFAQs() {
  const faqs = await prisma.fAQ.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
    take: 4,
  });
  return faqs;
}

// ─── Why Choose Us data ─────────────────────────────────────────

const WHY_CHOOSE_US = [
  {
    icon: Leaf,
    title: "Premium Quality",
    description:
      "Carefully selected spices from the finest growing regions across the Indonesian archipelago.",
    color: "text-green-600 bg-green-100 dark:bg-green-900/50",
  },
  {
    icon: Award,
    title: "100% Authentic",
    description:
      "Directly sourced from local farmers and traditional growers. No additives, no fillers.",
    color: "text-gold-600 bg-gold-100 dark:bg-gold-900/50",
  },
  {
    icon: Truck,
    title: "Fresh Delivery",
    description:
      "Packed and shipped with care to preserve aroma, flavor, and nutritional value.",
    color: "text-brown-600 bg-brown-100 dark:bg-brown-900/50",
  },
  {
    icon: ShieldCheck,
    title: "Trusted Source",
    description:
      "Serving customers worldwide with consistent quality, fair trade practices, and satisfaction guaranteed.",
    color: "text-green-600 bg-green-100 dark:bg-green-900/50",
  },
];

// ─── Star Rating Component ──────────────────────────────────────

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating
              ? "fill-gold-400 text-gold-400"
              : "fill-green-200 text-green-200 dark:fill-green-800 dark:text-green-800"
          }`}
        />
      ))}
    </div>
  );
}

// ─── Home Page ──────────────────────────────────────────────────

export default async function HomePage() {
  const [featuredProducts, testimonials, faqs] = await Promise.all([
    getFeaturedProducts(),
    getTestimonials(),
    getFAQs(),
  ]);

  return (
    <>
      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative flex min-h-[85vh] items-center overflow-hidden bg-gradient-to-br from-green-900 via-green-800 to-green-950">
        {/* Background pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDE4YzAtMy4zMTQgMi42ODYtNiA2LTZzNiAyLjY4NiA2IDYtMi42ODYgNi02IDYtNi0yLjY4Ni02LTZ6TTEyIDM4YzAtMy4zMTQgMi42ODYtNiA2LTZzNiAyLjY4NiA2IDYtMi42ODYgNi02IDYtNi0yLjY4Ni02LTZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
        {/* Gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-950/80 via-green-900/60 to-green-950/80" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-400/30 bg-green-800/40 px-4 py-1.5 text-sm text-green-200 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-gold-400" />
              <span>Authentic Indonesian Spices Since 2020</span>
            </div>

            <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
              The True Essence of{" "}
              <span className="bg-gradient-to-r from-gold-300 to-gold-500 bg-clip-text text-transparent">
                Indonesia
              </span>
            </h1>

            <p className="mb-8 max-w-2xl text-lg leading-relaxed text-green-200 sm:text-xl">
              Explore our curated collection of premium spices, herbs, and
              seasonings — hand-selected from the most fertile regions across
              the archipelago. Bring the authentic flavors of Nusantara to your
              kitchen.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link href="/products">
                <Button
                  size="lg"
                  className="bg-gold-500 text-green-950 hover:bg-gold-400 hover:text-green-900"
                >
                  Shop Now
                  <ArrowRight className="ml-1 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/about">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-green-300/50 text-green-100 hover:bg-green-800/50 hover:text-white"
                >
                  Our Story
                </Button>
              </Link>
            </div>

            {/* Trust badges */}
            <div className="mt-12 flex flex-wrap items-center gap-6 text-sm text-green-300">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-green-400" />
                Direct from Farms
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-green-400" />
                100% Natural
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-green-400" />
                Worldwide Shipping
              </span>
            </div>
          </div>
        </div>

        {/* Decorative shape */}
        <div className="absolute -bottom-2 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent dark:from-green-950" />
      </section>

      {/* ═══════════════ COMPANY INTRODUCTION ═══════════════ */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <Badge variant="secondary" className="mb-4">
                About Rempah Indonesia
              </Badge>
              <h2 className="mb-6 text-3xl font-bold leading-tight text-brown-800 dark:text-cream-100 sm:text-4xl">
                Bringing the Aromas of{" "}
                <span className="text-green-700 dark:text-green-400">
                  Nusantara
                </span>{" "}
                to the World
              </h2>
              <p className="mb-4 leading-relaxed text-green-700 dark:text-green-300">
                Rempah Indonesia was founded with a singular mission: to share
                the extraordinary richness of Indonesian spices with the world.
                Nestled in the heart of the archipelago, our country has been a
                global center of spice trade for centuries — and we bring that
                heritage directly to you.
              </p>
              <p className="mb-6 leading-relaxed text-green-600 dark:text-green-400">
                We work hand-in-hand with local farmers across Java, Sumatra,
                Sulawesi, and the Maluku Islands — the original &quot;Spice
                Islands&quot; — to source the highest quality spices, grown
                using traditional, sustainable methods passed down through
                generations.
              </p>
              <Link href="/about">
                <Button variant="outline">
                  Learn More About Us
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-green-200 to-green-300 dark:from-green-800 dark:to-green-900" />
              {/* Decorative */}
              <div className="absolute -bottom-4 -right-4 -z-10 h-full w-full rounded-2xl border-2 border-green-200 dark:border-green-700" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ VISION & MISSION ═══════════════ */}
      <section className="bg-gradient-to-b from-green-50 to-white py-20 dark:from-green-950/50 dark:to-green-950 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <Badge variant="secondary" className="mb-4">
              Our Purpose
            </Badge>
            <h2 className="text-3xl font-bold text-brown-800 dark:text-cream-100 sm:text-4xl">
              Vision &amp; Mission
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            <Card className="border-green-200/60 bg-white/80 backdrop-blur-sm dark:border-green-800/60 dark:bg-green-900/30">
              <CardHeader>
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gold-100 text-gold-600 dark:bg-gold-900/50 dark:text-gold-400">
                  <Sparkles className="h-6 w-6" />
                </div>
                <CardTitle>Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed text-green-700 dark:text-green-300">
                  To be the world&apos;s most trusted source of authentic
                  Indonesian spices, preserving the rich culinary heritage of
                  Nusantara while empowering local farming communities through
                  sustainable and equitable trade.
                </p>
              </CardContent>
            </Card>
            <Card className="border-green-200/60 bg-white/80 backdrop-blur-sm dark:border-green-800/60 dark:bg-green-900/30">
              <CardHeader>
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400">
                  <Award className="h-6 w-6" />
                </div>
                <CardTitle>Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    "Source the highest quality spices from sustainable farms across Indonesia",
                    "Support local farmers through fair trade partnerships and community programs",
                    "Deliver authentic flavors with exceptional freshness and quality",
                    "Educate the world about the rich culinary traditions of Indonesia",
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-green-700 dark:text-green-300"
                    >
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ═══════════════ FEATURED PRODUCTS ═══════════════ */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div>
              <Badge variant="secondary" className="mb-4">
                Our Selection
              </Badge>
              <h2 className="text-3xl font-bold text-brown-800 dark:text-cream-100 sm:text-4xl">
                Featured Products
              </h2>
            </div>
            <Link href="/products">
              <Button variant="outline" className="shrink-0">
                View All Products
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product) => {
                const primaryImage = product.images[0];
                return (
                  <Link key={product.id} href={`/products/${product.id}`}>
                    <Card className="group h-full overflow-hidden transition-shadow hover:shadow-lg">
                      <div className="relative aspect-square overflow-hidden bg-green-50 dark:bg-green-950">
                        {primaryImage ? (
                          <Image
                            src={primaryImage.url}
                            alt={primaryImage.alt ?? product.name}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <Leaf className="h-12 w-12 text-green-300 dark:text-green-700" />
                          </div>
                        )}
                        <div className="absolute left-3 top-3">
                          <Badge variant="secondary">
                            {product.category.name}
                          </Badge>
                        </div>
                        {product.stock <= 0 && (
                          <div className="absolute right-3 top-3">
                            <Badge variant="destructive">Out of Stock</Badge>
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="mb-1 font-semibold text-brown-800 transition-colors group-hover:text-green-700 dark:text-cream-100 dark:group-hover:text-green-400">
                          {product.name}
                        </h3>
                        <p className="mb-2 text-xs text-green-500 dark:text-green-500">
                          {product.origin && `Origin: ${product.origin}`}
                        </p>
                        <p className="text-lg font-bold text-green-700 dark:text-green-400">
                          {formatPrice(product.price)}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-green-300 bg-green-50/50 p-16 text-center dark:border-green-700 dark:bg-green-900/20">
              <Leaf className="mx-auto mb-4 h-12 w-12 text-green-400" />
              <h3 className="mb-2 text-xl font-semibold text-brown-800 dark:text-cream-100">
                Products Coming Soon
              </h3>
              <p className="text-green-600 dark:text-green-400">
                We&apos;re preparing our spice collection. Check back soon!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════ WHY CHOOSE US ═══════════════ */}
      <section className="bg-gradient-to-b from-white to-green-50 py-20 dark:from-green-950 dark:to-green-950/50 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <Badge variant="secondary" className="mb-4">
              Why Choose Us
            </Badge>
            <h2 className="mb-4 text-3xl font-bold text-brown-800 dark:text-cream-100 sm:text-4xl">
              The Rempah Indonesia Difference
            </h2>
            <p className="mx-auto max-w-2xl text-green-600 dark:text-green-400">
              We take pride in every spice we source, ensuring that each product
              meets the highest standards of quality, authenticity, and
              sustainability.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {WHY_CHOOSE_US.map((item) => {
              const Icon = item.icon;
              return (
                <Card
                  key={item.title}
                  className="border-green-200/60 bg-white/70 text-center backdrop-blur-sm transition-shadow hover:shadow-md dark:border-green-800/60 dark:bg-green-900/30"
                >
                  <CardContent className="p-6">
                    <div
                      className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl ${item.color}`}
                    >
                      <Icon className="h-8 w-8" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-brown-800 dark:text-cream-100">
                      {item.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-green-600 dark:text-green-400">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════ TESTIMONIALS ═══════════════ */}
      {testimonials.length > 0 && (
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <Badge variant="secondary" className="mb-4">
                Testimonials
              </Badge>
              <h2 className="text-3xl font-bold text-brown-800 dark:text-cream-100 sm:text-4xl">
                What Our Customers Say
              </h2>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {testimonials.map((t) => (
                <Card
                  key={t.id}
                  className="relative border-green-200/60 bg-white/80 backdrop-blur-sm dark:border-green-800/60 dark:bg-green-900/30"
                >
                  <Quote className="absolute right-4 top-4 h-8 w-8 text-green-200 dark:text-green-800" />
                  <CardContent className="p-6">
                    <StarRating rating={t.rating} />
                    <p className="my-4 leading-relaxed text-green-700 dark:text-green-300">
                      &ldquo;{t.content}&rdquo;
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-700 text-sm font-bold text-white">
                        {t.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-brown-800 dark:text-cream-100">
                          {t.name}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════ FAQ PREVIEW ═══════════════ */}
      {faqs.length > 0 && (
        <section className="bg-green-50/50 py-20 dark:bg-green-950/20 md:py-28">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <Badge variant="secondary" className="mb-4">
                FAQ
              </Badge>
              <h2 className="text-3xl font-bold text-brown-800 dark:text-cream-100 sm:text-4xl">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq) => (
                <details
                  key={faq.id}
                  className="group rounded-xl border border-green-200/60 bg-white/80 backdrop-blur-sm transition-shadow open:shadow-md dark:border-green-800/60 dark:bg-green-900/30"
                >
                  <summary className="flex cursor-pointer items-center justify-between px-6 py-4 text-sm font-medium text-brown-800 dark:text-cream-100 [&::-webkit-details-marker]:hidden">
                    {faq.question}
                    <ChevronRight className="h-4 w-4 shrink-0 text-green-500 transition-transform group-open:rotate-90" />
                  </summary>
                  <div className="px-6 pb-4">
                    <p className="text-sm leading-relaxed text-green-600 dark:text-green-400">
                      {faq.answer}
                    </p>
                  </div>
                </details>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link href="/faq">
                <Button variant="outline">
                  View All FAQs
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════ CONTACT CTA ═══════════════ */}
      <section className="relative overflow-hidden py-20 md:py-28">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-800 via-green-700 to-green-900" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIvPjwvZz48L2c+PC9zdmc+')] opacity-20" />

        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
            Get in Touch
          </h2>
          <p className="mb-8 text-lg leading-relaxed text-green-200">
            Have questions about our products, want to place a bulk order, or
            just want to learn more about Indonesian spices? We&apos;d love to
            hear from you.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact">
              <Button
                size="lg"
                className="bg-gold-500 text-green-950 hover:bg-gold-400"
              >
                <MessageCircle className="mr-1 h-5 w-5" />
                Contact Us
              </Button>
            </Link>
            <Link href="/products">
              <Button
                size="lg"
                variant="outline"
                className="border-green-300/50 text-green-100 hover:bg-green-800/50 hover:text-white"
              >
                <Leaf className="mr-1 h-5 w-5" />
                Explore Products
              </Button>
            </Link>
          </div>

          {/* Contact info */}
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {[
              {
                icon: Phone,
                label: "Call Us",
                value: "+62 812-3456-7890",
              },
              {
                icon: Mail,
                label: "Email Us",
                value: "info@rempah-indonesia.com",
              },
              {
                icon: MapPin,
                label: "Visit Us",
                value: "Jakarta, Indonesia",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="rounded-xl border border-green-400/20 bg-white/10 p-4 backdrop-blur-sm"
                >
                  <Icon className="mx-auto mb-2 h-6 w-6 text-gold-400" />
                  <p className="text-sm font-medium text-green-200">
                    {item.label}
                  </p>
                  <p className="text-sm text-white">{item.value}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
