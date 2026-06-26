import { prisma } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Leaf,
  Award,
  Sparkles,
  HeartHandshake,
  Globe,
  CheckCircle2,
  Quote,
  Users,
  Target,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

// ─── Data fetching ──────────────────────────────────────────────

async function getCompanyProfile() {
  const profile = await prisma.companyProfile.findUnique({
    where: { id: "main" },
  });
  return profile;
}

async function getTestimonials() {
  const testimonials = await prisma.testimonial.findMany({
    orderBy: { createdAt: "desc" },
    take: 3,
  });
  return testimonials;
}

// ─── Team values ────────────────────────────────────────────────

const CORE_VALUES = [
  {
    icon: Leaf,
    title: "Quality First",
    description:
      "We never compromise on quality. Every spice is hand-selected and rigorously tested to ensure it meets our premium standards.",
  },
  {
    icon: HeartHandshake,
    title: "Fair Trade",
    description:
      "We believe in equitable partnerships with local farmers, ensuring they receive fair compensation for their craft.",
  },
  {
    icon: Globe,
    title: "Sustainability",
    description:
      "Our sourcing practices prioritize environmental stewardship and sustainable farming methods.",
  },
  {
    icon: Users,
    title: "Community",
    description:
      "We invest in the communities that grow our spices, supporting education, infrastructure, and local development.",
  },
  {
    icon: Target,
    title: "Authenticity",
    description:
      "Every product we sell carries the true essence of Indonesia — unadulterated, pure, and genuine.",
  },
  {
    icon: Eye,
    title: "Transparency",
    description:
      "From farm to table, we maintain complete traceability so you know exactly where your spices come from.",
  },
];

// ─── Milestones ─────────────────────────────────────────────────

const MILESTONES = [
  { year: "2020", event: "Rempah Indonesia founded in Jakarta" },
  {
    year: "2021",
    event: "Partnered with 50+ local farmers across Java and Sumatra",
  },
  {
    year: "2022",
    event: "Expanded to international shipping, reaching 15 countries",
  },
  {
    year: "2023",
    event: "Launched direct-to-consumer platform and mobile app",
  },
  {
    year: "2024",
    event: "Certified as a Fair Trade partner; 200+ farmer partnerships",
  },
];

// ─── About Page ─────────────────────────────────────────────────

export default async function AboutPage() {
  const [profile, testimonials] = await Promise.all([
    getCompanyProfile(),
    getTestimonials(),
  ]);

  return (
    <div className="min-h-screen">
      {/* ═══════════════ Hero ═══════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-900 via-green-800 to-green-950 py-24 md:py-32">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDE4YzAtMy4zMTQgMi42ODYtNiA2LTZzNiAyLjY4NiA2IDYtMi42ODYgNi02IDYtNi0yLjY4Ni02LTZ6TTEyIDM4YzAtMy4zMTQgMi42ODYtNiA2LTZzNiAyLjY4NiA2IDYtMi42ODYgNi02IDYtNi0yLjY4Ni02LTZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <Badge variant="secondary" className="mb-4">
            About Us
          </Badge>
          <h1 className="mb-6 text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
            Our Story
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-green-200">
            From the lush farms of the Indonesian archipelago to kitchens around
            the world — discover the journey of Rempah Indonesia.
          </p>
        </div>
      </section>

      {/* ═══════════════ Company Story ═══════════════ */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <Badge variant="secondary" className="mb-4">
                Our Journey
              </Badge>
              <h2 className="mb-6 text-3xl font-bold leading-tight text-brown-800 dark:text-cream-100 sm:text-4xl">
                A Heritage of Flavor, A Future of{" "}
                <span className="text-green-700 dark:text-green-400">
                  Sustainability
                </span>
              </h2>
              <div className="space-y-4 leading-relaxed text-green-700 dark:text-green-300">
                <p>
                  Rempah Indonesia was born from a deep love for the rich
                  culinary traditions of the Indonesian archipelago. For
                  centuries, the islands of Nusantara have been renowned as the
                  world&apos;s spice garden — the legendary Spice Islands that
                  drew explorers from across the globe.
                </p>
                <p>
                  Founded in 2020, our mission is to honor this incredible
                  heritage by connecting the world directly with the farmers and
                  growers who cultivate these extraordinary spices. We believe
                  that the best spices come from healthy soil, skilled hands,
                  and generations of knowledge passed down through families.
                </p>
                <p>
                  Today, we work with over 200 farming families across Java,
                  Sumatra, Sulawesi, and the Maluku Islands. Every spice we sell
                  is traceable back to its source — ensuring quality,
                  authenticity, and fair compensation for our growers.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-green-200 to-green-300 dark:from-green-800 dark:to-green-900" />
              <div className="absolute -bottom-4 -right-4 -z-10 h-full w-full rounded-2xl border-2 border-green-200 dark:border-green-700" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ Milestones ═══════════════ */}
      <section className="bg-green-50/50 py-20 dark:bg-green-950/20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <Badge variant="secondary" className="mb-4">
              Our Timeline
            </Badge>
            <h2 className="text-3xl font-bold text-brown-800 dark:text-cream-100 sm:text-4xl">
              Key Milestones
            </h2>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-gradient-to-b from-green-300 via-green-500 to-green-300 dark:from-green-700 dark:via-green-500 dark:to-green-700" />

            <div className="space-y-12">
              {MILESTONES.map((m, i) => (
                <div
                  key={m.year}
                  className={`relative flex items-center gap-8 ${
                    i % 2 === 0 ? "flex-row" : "flex-row-reverse"
                  }`}
                >
                  <div className="w-1/2 text-right">
                    {i % 2 === 0 && (
                      <div>
                        <span className="text-2xl font-bold text-green-700 dark:text-green-400">
                          {m.year}
                        </span>
                        <p className="mt-1 text-green-600 dark:text-green-400">
                          {m.event}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="relative flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-green-600 ring-4 ring-white dark:ring-green-950">
                    <div className="h-2 w-2 rounded-full bg-white" />
                  </div>
                  <div className="w-1/2">
                    {i % 2 !== 0 && (
                      <div>
                        <span className="text-2xl font-bold text-green-700 dark:text-green-400">
                          {m.year}
                        </span>
                        <p className="mt-1 text-green-600 dark:text-green-400">
                          {m.event}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ Vision & Mission ═══════════════ */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
                  {profile?.vision ??
                    "To be the world's most trusted source of authentic Indonesian spices, preserving the rich culinary heritage of Nusantara while empowering local farming communities through sustainable and equitable trade."}
                </p>
              </CardContent>
            </Card>
            <Card className="border-green-200/60 bg-white/80 backdrop-blur-sm dark:border-green-800/60 dark:bg-green-900/30">
              <CardHeader>
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400">
                  <Target className="h-6 w-6" />
                </div>
                <CardTitle>Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed text-green-700 dark:text-green-300">
                  {profile?.mission ??
                    "To source the highest quality spices from sustainable farms across Indonesia, support local farmers through fair trade partnerships, and deliver authentic flavors with exceptional freshness to customers worldwide."}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ═══════════════ Core Values ═══════════════ */}
      <section className="bg-gradient-to-b from-white to-green-50 py-20 dark:from-green-950 dark:to-green-950/50 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <Badge variant="secondary" className="mb-4">
              Our Values
            </Badge>
            <h2 className="mb-4 text-3xl font-bold text-brown-800 dark:text-cream-100 sm:text-4xl">
              What We Stand For
            </h2>
            <p className="mx-auto max-w-2xl text-green-600 dark:text-green-400">
              These core principles guide every decision we make and every spice
              we source.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CORE_VALUES.map((value) => {
              const Icon = value.icon;
              return (
                <Card
                  key={value.title}
                  className="border-green-200/60 bg-white/70 backdrop-blur-sm transition-shadow hover:shadow-md dark:border-green-800/60 dark:bg-green-900/30"
                >
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-brown-800 dark:text-cream-100">
                      {value.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-green-600 dark:text-green-400">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════ Testimonials ═══════════════ */}
      {testimonials.length > 0 && (
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <Badge variant="secondary" className="mb-4">
                Testimonials
              </Badge>
              <h2 className="text-3xl font-bold text-brown-800 dark:text-cream-100 sm:text-4xl">
                What People Say About Us
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
                    <p className="mb-4 leading-relaxed text-green-700 dark:text-green-300">
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

      {/* ═══════════════ CTA ═══════════════ */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-green-800 via-green-700 to-green-900" />
        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
            Ready to Explore Our Spices?
          </h2>
          <p className="mb-8 text-lg leading-relaxed text-green-200">
            Browse our curated collection of premium Indonesian spices, herbs,
            and seasonings.
          </p>
          <Link href="/products">
            <Button
              size="lg"
              className="bg-gold-500 text-green-950 hover:bg-gold-400"
            >
              View Our Products
              <ArrowRight className="ml-1 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
