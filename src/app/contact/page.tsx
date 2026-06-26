'use client'

import * as React from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Send,
  CheckCircle2,
  Clock,
  Loader2,
} from 'lucide-react'

// ─── Contact Info ───────────────────────────────────────────────

const CONTACT_INFO = [
  {
    icon: MapPin,
    label: 'Address',
    value: 'Jl. Rempah Nusantara No. 123\nJakarta Pusat, 10110\nIndonesia',
    action: 'Get Directions',
    href: 'https://maps.google.com',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+62 812-3456-7890\n+62 821-9876-5432',
    action: 'Call Us',
    href: 'tel:+6281234567890',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'info@rempah-indonesia.com\nsupport@rempah-indonesia.com',
    action: 'Send Email',
    href: 'mailto:info@rempah-indonesia.com',
  },
  {
    icon: Clock,
    label: 'Business Hours',
    value: 'Monday - Friday: 08:00 - 17:00\nSaturday: 08:00 - 14:00\nSunday: Closed',
    action: null,
    href: null,
  },
]

// ─── Contact Page ───────────────────────────────────────────────

export default function ContactPage() {
  const [formState, setFormState] = React.useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [submitted, setSubmitted] = React.useState(false)
  const [error, setError] = React.useState('')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to send message')
      }

      setSubmitted(true)
      setFormState({ name: '', email: '', phone: '', message: '' })
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Something went wrong. Please try again.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  // ─── Success View ───────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen">
        <section className="relative overflow-hidden bg-gradient-to-br from-green-900 via-green-800 to-green-950 py-24 md:py-32">
          <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <Badge variant="secondary" className="mb-4">
              Contact
            </Badge>
            <h1 className="mb-6 text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
              Get in Touch
            </h1>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-green-200">
              We&apos;d love to hear from you. Send us a message and we&apos;ll
              respond as soon as possible.
            </p>
          </div>
        </section>

        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-lg px-4 text-center sm:px-6 lg:px-8">
            <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
              <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="mb-2 text-3xl font-bold text-brown-800 dark:text-cream-100">
              Message Sent!
            </h2>
            <p className="mb-8 text-green-600 dark:text-green-400">
              Thank you for reaching out. We&apos;ll get back to you within 24
              hours.
            </p>
            <Button
              variant="outline"
              onClick={() => setSubmitted(false)}
            >
              Send Another Message
            </Button>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* ═══════════════ Hero ═══════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-900 via-green-800 to-green-950 py-24 md:py-32">
        <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <Badge variant="secondary" className="mb-4">
            Contact
          </Badge>
          <h1 className="mb-6 text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
            Get in Touch
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-green-200">
            We&apos;d love to hear from you. Send us a message and we&apos;ll
            respond as soon as possible.
          </p>
        </div>
      </section>

      {/* ═══════════════ Contact Form + Info ═══════════════ */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-5">
            {/* Contact Form */}
            <div className="lg:col-span-3">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-brown-800 dark:text-cream-100">
                  Send Us a Message
                </h2>
                <p className="mt-2 text-green-600 dark:text-green-400">
                  Fill out the form below and we&apos;ll get back to you as
                  soon as possible.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-1.5 block text-sm font-medium text-brown-800 dark:text-cream-100"
                  >
                    Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formState.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    required
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-1.5 block text-sm font-medium text-brown-800 dark:text-cream-100"
                    >
                      Email <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formState.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-1.5 block text-sm font-medium text-brown-800 dark:text-cream-100"
                    >
                      Phone
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formState.phone}
                      onChange={handleChange}
                      placeholder="+62 812-3456-7890"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="mb-1.5 block text-sm font-medium text-brown-800 dark:text-cream-100"
                  >
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    value={formState.message}
                    onChange={handleChange}
                    required
                    placeholder="Tell us how we can help you..."
                    className="flex w-full rounded-lg border border-green-300 bg-white px-3 py-2 text-sm text-green-900 placeholder:text-green-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-green-700 dark:bg-green-950 dark:text-green-50 dark:placeholder:text-green-500 dark:focus-visible:ring-green-500"
                  />
                </div>

                {error && (
                  <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-1 h-4 w-4" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Contact Info Sidebar */}
            <div className="lg:col-span-2">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-brown-800 dark:text-cream-100">
                  Contact Information
                </h2>
                <p className="mt-2 text-green-600 dark:text-green-400">
                  Reach out to us through any of these channels.
                </p>
              </div>

              <div className="space-y-4">
                {CONTACT_INFO.map((item) => {
                  const Icon = item.icon
                  return (
                    <Card
                      key={item.label}
                      className="border-green-200/60 bg-white/70 backdrop-blur-sm dark:border-green-800/60 dark:bg-green-900/30"
                    >
                      <CardContent className="flex items-start gap-4 p-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-brown-800 dark:text-cream-100">
                            {item.label}
                          </p>
                          <p className="mt-0.5 whitespace-pre-line text-sm text-green-600 dark:text-green-400">
                            {item.value}
                          </p>
                          {item.action && item.href && (
                            <a
                              href={item.href}
                              className="mt-1 inline-block text-xs font-medium text-green-700 underline-offset-2 hover:underline dark:text-green-300"
                            >
                              {item.action} →
                            </a>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {/* WhatsApp CTA */}
              <div className="mt-6 rounded-xl border border-green-200/60 bg-green-50/80 p-6 backdrop-blur-sm dark:border-green-800/60 dark:bg-green-900/30">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-500 text-white">
                    <MessageCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="mb-1 text-base font-semibold text-brown-800 dark:text-cream-100">
                      Chat with Us on WhatsApp
                    </h3>
                    <p className="mb-3 text-sm text-green-600 dark:text-green-400">
                      Prefer instant messaging? Reach out to us on WhatsApp for
                      quick responses.
                    </p>
                    <a
                      href="https://wa.me/6281234567890"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button size="sm" className="bg-green-500 hover:bg-green-600">
                        <MessageCircle className="mr-1 h-4 w-4" />
                        WhatsApp Us
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
