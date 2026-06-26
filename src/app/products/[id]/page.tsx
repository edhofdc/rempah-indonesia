import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { formatPrice } from '@/lib/utils'
import { AddToCartButton } from './add-to-cart-button'
import {
  Leaf,
  Package,
  MapPin,
  Scale,
  Heart,
  ChevronRight,
  Home,
  CheckCircle2,
  Clock,
  Truck,
  Sparkles,
  Star,
} from 'lucide-react'

// ─── Data fetching ──────────────────────────────────────────────

async function getProduct(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      images: { orderBy: { isPrimary: 'desc' } },
    },
  })
  return product
}

async function getRelatedProducts(
  categoryId: string,
  excludeId: string,
  limit = 4,
) {
  const products = await prisma.product.findMany({
    where: {
      categoryId,
      id: { not: excludeId },
      status: 'active',
    },
    include: {
      images: { where: { isPrimary: true }, take: 1 },
    },
    take: limit,
  })
  return products
}

// ─── Benefits list parser ───────────────────────────────────────

function parseBenefits(benefits: string | null): string[] {
  if (!benefits) return []
  return benefits
    .split('\n')
    .map((b) => b.trim())
    .filter(Boolean)
}

// ─── Breadcrumb ─────────────────────────────────────────────────

function ProductBreadcrumb({
  categoryName,
  productName,
}: {
  categoryName: string
  productName: string
}) {
  return (
    <nav className="flex items-center gap-2 text-sm text-green-500">
      <Link
        href="/"
        className="flex items-center gap-1 transition-colors hover:text-green-700 dark:hover:text-green-300"
      >
        <Home className="h-3.5 w-3.5" />
        Home
      </Link>
      <ChevronRight className="h-3.5 w-3.5" />
      <Link
        href="/products"
        className="transition-colors hover:text-green-700 dark:hover:text-green-300"
      >
        Products
      </Link>
      <ChevronRight className="h-3.5 w-3.5" />
      <Link
        href={`/products?category=${encodeURIComponent(categoryName)}`}
        className="transition-colors hover:text-green-700 dark:hover:text-green-300"
      >
        {categoryName}
      </Link>
      <ChevronRight className="h-3.5 w-3.5" />
      <span className="text-green-700 dark:text-green-300">{productName}</span>
    </nav>
  )
}

// ─── Product Detail Page ────────────────────────────────────────

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const product = await getProduct(id)

  if (!product) {
    notFound()
  }

  const relatedProducts = await getRelatedProducts(
    product.categoryId,
    product.id,
  )
  const benefits = parseBenefits(product.benefits)

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-green-950 dark:to-green-950">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <ProductBreadcrumb
          categoryName={product.category.name}
          productName={product.name}
        />
      </div>

      {/* ═══════════════ Product Main ═══════════════ */}
      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-green-50 dark:bg-green-950">
              {product.images.length > 0 ? (
                <Image
                  src={product.images[0].url}
                  alt={product.images[0].alt ?? product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <Package className="h-20 w-20 text-green-300 dark:text-green-700" />
                </div>
              )}

              {/* Badges overlay */}
              <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                <Badge variant="secondary" className="text-xs">
                  {product.category.name}
                </Badge>
                {product.stock <= 0 && (
                  <Badge variant="destructive">Out of Stock</Badge>
                )}
                {product.stock > 0 && product.stock < 10 && (
                  <Badge variant="gold">Low Stock</Badge>
                )}
                {product.stock > 10 && (
                  <Badge variant="success">In Stock</Badge>
                )}
              </div>
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <div
                    key={img.id}
                    className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-colors ${
                      idx === 0
                        ? 'border-green-600 dark:border-green-500'
                        : 'border-green-200 hover:border-green-400 dark:border-green-800 dark:hover:border-green-600'
                    }`}
                  >
                    <Image
                      src={img.url}
                      alt={img.alt ?? `${product.name} ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col gap-6">
            <div>
              <Badge variant="secondary" className="mb-3">
                {product.category.name}
              </Badge>
              <h1 className="text-3xl font-bold text-brown-800 dark:text-cream-100 sm:text-4xl">
                {product.name}
              </h1>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-green-700 dark:text-green-400">
                {formatPrice(product.price)}
              </span>
              {product.weight && (
                <span className="text-sm text-green-500">/{product.weight}</span>
              )}
            </div>

            {/* Quick specs */}
            <div className="flex flex-wrap gap-4 text-sm">
              {product.origin && (
                <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400">
                  <MapPin className="h-4 w-4" />
                  <span>Origin: {product.origin}</span>
                </div>
              )}
              {product.weight && (
                <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400">
                  <Scale className="h-4 w-4" />
                  <span>Weight: {product.weight}</span>
                </div>
              )}
            </div>

            {/* Stock status */}
            <div className="flex items-center gap-2">
              {product.stock > 0 ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-700 dark:text-green-300">
                    {product.stock >= 10
                      ? 'In Stock'
                      : `Only ${product.stock} left in stock`}
                  </span>
                </>
              ) : (
                <>
                  <Clock className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-red-600 dark:text-red-400">
                    Out of Stock
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-brown-800 dark:text-cream-100">
                Description
              </h3>
              <p className="leading-relaxed text-green-700 dark:text-green-300">
                {product.description}
              </p>
            </div>

            {/* Benefits */}
            {benefits.length > 0 && (
              <div>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-brown-800 dark:text-cream-100">
                  Benefits
                </h3>
                <ul className="space-y-2">
                  {benefits.map((benefit, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-green-700 dark:text-green-300"
                    >
                      <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Add to Cart */}
            <div className="rounded-xl border border-green-200 bg-white/80 p-6 backdrop-blur-sm dark:border-green-800 dark:bg-green-900/30">
              <div className="flex items-center gap-4">
                <AddToCartButton
                  product={{
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image:
                      product.images[0]?.url ??
                      '/placeholder-product.svg',
                    slug: product.slug,
                  }}
                  disabled={product.stock <= 0}
                />
              </div>
              <div className="mt-4 flex items-center gap-4 text-xs text-green-500">
                <span className="flex items-center gap-1">
                  <Truck className="h-3.5 w-3.5" />
                  Free shipping over Rp 500k
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  100% Authentic
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ Related Products ═══════════════ */}
      {relatedProducts.length > 0 && (
        <section className="border-t border-green-200/60 bg-white/50 py-16 dark:border-green-800/60 dark:bg-green-950/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-brown-800 dark:text-cream-100">
                Related Products
              </h2>
              <Link href="/products">
                <Button variant="outline" size="sm">
                  View All
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((rp) => {
                const primaryImage = rp.images[0]
                return (
                  <Link key={rp.id} href={`/products/${rp.id}`}>
                    <Card className="group h-full overflow-hidden transition-shadow hover:shadow-lg">
                      <div className="relative aspect-square overflow-hidden bg-green-50 dark:bg-green-950">
                        {primaryImage ? (
                          <Image
                            src={primaryImage.url}
                            alt={primaryImage.alt ?? rp.name}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <Leaf className="h-12 w-12 text-green-300 dark:text-green-700" />
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="mb-1 font-semibold text-brown-800 transition-colors group-hover:text-green-700 dark:text-cream-100 dark:group-hover:text-green-400">
                          {rp.name}
                        </h3>
                        <p className="text-lg font-bold text-green-700 dark:text-green-400">
                          {formatPrice(rp.price)}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════ Trust Signals ═══════════════ */}
      <section className="border-t border-green-200/60 py-12 dark:border-green-800/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 text-center sm:grid-cols-4">
            {[
              {
                icon: Leaf,
                title: '100% Natural',
                desc: 'No additives or preservatives',
              },
              {
                icon: Truck,
                title: 'Fast Shipping',
                desc: 'Orders processed within 24 hours',
              },
              {
                icon: Heart,
                title: 'Fair Trade',
                desc: 'Supporting local farmers',
              },
              {
                icon: Star,
                title: 'Premium Quality',
                desc: 'Hand-selected & inspected',
              },
            ].map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.title}
                  className="rounded-xl border border-green-200/60 bg-white/50 p-4 backdrop-blur-sm dark:border-green-800/60 dark:bg-green-900/20"
                >
                  <Icon className="mx-auto mb-2 h-6 w-6 text-green-600 dark:text-green-400" />
                  <p className="text-sm font-semibold text-brown-800 dark:text-cream-100">
                    {item.title}
                  </p>
                  <p className="text-xs text-green-500">{item.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
