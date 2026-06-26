import { prisma } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, HelpCircle } from "lucide-react";

// ─── Data fetching ──────────────────────────────────────────────

async function getFAQs() {
  const faqs = await prisma.fAQ.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });
  return faqs;
}

// ─── FAQ Page ───────────────────────────────────────────────────

export default async function FAQPage() {
  const faqs = await getFAQs();

  return (
    <div className="min-h-screen">
      {/* ═══════════════ Hero ═══════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-900 via-green-800 to-green-950 py-24 md:py-32">
        <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <Badge variant="secondary" className="mb-4">
            FAQ
          </Badge>
          <h1 className="mb-6 text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
            Frequently Asked Questions
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-green-200">
            Find answers to the most common questions about our products,
            ordering process, shipping, and more.
          </p>
        </div>
      </section>

      {/* ═══════════════ FAQ Accordion ═══════════════ */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {faqs.length > 0 ? (
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <details
                  key={faq.id}
                  className="group rounded-xl border border-green-200/60 bg-white/80 backdrop-blur-sm transition-all open:shadow-lg dark:border-green-800/60 dark:bg-green-900/30"
                >
                  <summary className="flex cursor-pointer items-center justify-between gap-4 px-6 py-5 text-sm font-medium text-brown-800 transition-colors hover:text-green-700 dark:text-cream-100 dark:hover:text-green-400 [&::-webkit-details-marker]:hidden">
                    <span className="flex items-start gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-700 dark:bg-green-900 dark:text-green-300">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="pt-0.5">{faq.question}</span>
                    </span>
                    <ChevronRight className="h-5 w-5 shrink-0 text-green-500 transition-transform duration-200 group-open:rotate-90" />
                  </summary>
                  <div className="border-t border-green-100 px-6 py-5 dark:border-green-800">
                    <p className="leading-relaxed text-green-700 dark:text-green-300">
                      {faq.answer}
                    </p>
                  </div>
                </details>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-green-300 bg-green-50/50 p-16 text-center dark:border-green-700 dark:bg-green-900/20">
              <HelpCircle className="mx-auto mb-4 h-16 w-16 text-green-400" />
              <h2 className="mb-2 text-2xl font-semibold text-brown-800 dark:text-cream-100">
                No FAQs Yet
              </h2>
              <p className="text-green-600 dark:text-green-400">
                We&apos;re still putting together our FAQ section. In the
                meantime, feel free to contact us with any questions!
              </p>
            </div>
          )}

          {/* Still have questions? */}
          <div className="mt-12 rounded-2xl border border-green-200/60 bg-gradient-to-br from-green-50 to-white p-8 text-center dark:border-green-800/60 dark:from-green-900/30 dark:to-green-950">
            <HelpCircle className="mx-auto mb-4 h-10 w-10 text-green-500" />
            <h3 className="mb-2 text-xl font-semibold text-brown-800 dark:text-cream-100">
              Still Have Questions?
            </h3>
            <p className="mb-6 text-green-600 dark:text-green-400">
              Can&apos;t find the answer you&apos;re looking for? We&apos;re
              here to help.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="mailto:info@rempah-indonesia.com"
                className="inline-flex items-center gap-2 rounded-lg bg-green-700 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-green-800"
              >
                Email Us
              </a>
              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-green-300 bg-white px-6 py-2.5 text-sm font-medium text-green-800 shadow-sm transition-colors hover:bg-green-50 dark:border-green-700 dark:bg-green-950 dark:text-green-100 dark:hover:bg-green-900"
              >
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
