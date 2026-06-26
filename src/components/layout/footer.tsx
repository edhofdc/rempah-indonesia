import Link from 'next/link'
import {
  Leaf,
  Mail,
  Phone,
  MapPin,
  Globe,
  AtSign,
  Camera,
  ChevronRight,
} from 'lucide-react'

const QUICK_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Products', href: '/products' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Contact', href: '/contact' },
  { label: 'FAQ', href: '/faq' },
] as const

const CONTACT_INFO = [
  {
    icon: MapPin,
    label: 'Address',
    value: 'Jakarta, Indonesia',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+62 812-3456-7890',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'info@rempah-indonesia.com',
  },
] as const

const SOCIAL_LINKS = [
  { icon: Globe, href: '#', label: 'Website' },
  { icon: AtSign, href: '#', label: 'Social' },
  { icon: Camera, href: '#', label: 'Gallery' },
] as const

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-green-200/60 bg-gradient-to-b from-green-50 to-white dark:border-green-800/60 dark:from-green-950 dark:to-green-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div className="space-y-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-bold text-brown-800 dark:text-cream-100"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-green-600 to-green-800 text-sm font-bold text-white">
                R
              </span>
              Rempah Indonesia
            </Link>
            <p className="text-sm leading-relaxed text-green-600 dark:text-green-400">
              Your trusted source for authentic Indonesian spices and herbs.
              Bringing the rich flavors of the archipelago to kitchens
              worldwide since 2020.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map((social) => {
                const Icon = social.icon
                return (
                  <Link
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-green-100 text-green-700 transition-colors hover:bg-green-200 hover:text-green-800 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800 dark:hover:text-green-100"
                  >
                    <Icon className="h-4 w-4" />
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-brown-800 dark:text-cream-100">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1 text-sm text-green-600 transition-colors hover:text-green-800 dark:text-green-400 dark:hover:text-green-200"
                  >
                    <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-brown-800 dark:text-cream-100">
              Contact
            </h3>
            <ul className="space-y-3">
              {CONTACT_INFO.map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.label} className="flex items-start gap-3">
                    <Icon className="mt-0.5 h-4 w-4 shrink-0 text-green-600 dark:text-green-400" />
                    <div>
                      <p className="text-xs font-medium text-brown-600 dark:text-brown-400">
                        {item.label}
                      </p>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        {item.value}
                      </p>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Newsletter / Brand */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-brown-800 dark:text-cream-100">
              Authentic Spices
            </h3>
            <div className="rounded-xl border border-green-200 bg-white/60 p-4 backdrop-blur dark:border-green-800 dark:bg-green-900/60">
              <div className="flex items-center gap-3">
                <Leaf className="h-8 w-8 text-green-600 dark:text-green-400" />
                <div>
                  <p className="text-sm font-medium text-brown-800 dark:text-cream-100">
                    100% Natural
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400">
                    Direct from Indonesian farms
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 border-t border-green-200/60 pt-6 dark:border-green-800/60">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-xs text-green-500 dark:text-green-500">
              &copy; {currentYear} Rempah Indonesia. All rights reserved.
            </p>
            <div className="flex gap-4 text-xs text-green-500 dark:text-green-500">
              <Link
                href="#"
                className="transition-colors hover:text-green-700 dark:hover:text-green-300"
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                className="transition-colors hover:text-green-700 dark:hover:text-green-300"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
