import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/db'
import { Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { formatPrice } from '@/lib/utils'
import ProductsFilter from '@/components/products/products-filter'
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Package,
} from 'lucide-react'

const ITEMS_PER_PAGE = 12

// ─── Data fetching ──────────────────────────────────────────────

async function getCategories() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  })
  return categories
}

async function getProducts({
  search,
  categoryId,
  sort,
  page,
}: {
  search?: string
  categoryId?: string
  sort?: string
  page: number
}) {
  const where: Record<string, unknown> = { status: 'active' }

  if (search) {
    where.name = { contains: search }
  }

  if (categoryId) {
    where.categoryId = categoryId
  }

  let orderBy: Record<string, string> = { createdAt: 'desc' }
  if (sort === 'price-asc') orderBy = { price: 'asc' }
  else if (sort === 'price-desc') orderBy = { price: 'desc' }
  else if (sort === 'name-asc') orderBy = { name: 'asc' }
  else if (sort === 'name-desc') orderBy = { name: 'desc' }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: true,
        images: { where: { isPrimary: true }, take: 1 },
      },
      orderBy,
      skip: (page - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
    }),
    prisma.product.count({ where }),
  ])

  return { products, total, totalPages: Math.ceil(total / ITEMS_PER_PAGE) }
}

// ─── Page ───────────────────────────────────────────────────────

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const sp = await searchParams
  const currentPage = Math.max(1, Number(sp.page) || 1)
  const currentSearch = typeof sp.search === 'string' ? sp.search : ''
  const currentCategory = typeof sp.category === 'string' ? sp.category : ''
  const currentSort = typeof sp.sort === 'string' ? sp.sort : 'newest'

  const [categories, { products, total, totalPages }] = await Promise.all([
    getCategories(),
    getProducts({
      search: currentSearch,
      categoryId: currentCategory,
      sort: currentSort,
      page: currentPage,
    }),
  ])

  // Build base URL for pagination/filter links
  const buildUrl = (params: Record<string, string>) => {
    const usp = new URLSearchParams()
    const merged = {
      ...(currentSearch && { search: currentSearch }),
      ...(currentCategory && { category: currentCategory }),
      ...(currentSort !== 'newest' && { sort: currentSort }),
      ...params,
    }
    for (const [k, v] of Object.entries(merged)) {
      if (v) usp.set(k, v)
    }
    const qs = usp.toString()
    return `/products${qs ? `?${qs}` : ''}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-green-950 dark:to-green-950">
      {/* ═══════════════ Header ═══════════════ */}
      <section className="border-b border-green-200/60 bg-white/80 backdrop-blur-sm dark:border-green-800/60 dark:bg-green-950/80">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-brown-800 dark:text-cream-100 sm:text-4xl">
              Our Products
            </h1>
            <p className="mt-2 text-green-600 dark:text-green-400">
              Browse our collection of authentic Indonesian spices and herbs.
            </p>
          </div>

          <Suspense fallback={<div className="h-12 animate-pulse rounded-lg bg-green-100 dark:bg-green-900" />}>
            <ProductsFilter
              categories={categories}
              currentSearch={currentSearch}
              currentCategory={currentCategory}
              currentSort={currentSort}
            />
          </Suspense>
        </div>
      </section>

      {/* ═══════════════ Results ═══════════════ */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Result count */}
        <p className="mb-6 text-sm text-green-500">
          Showing{' '}
          <span className="font-medium text-green-700 dark:text-green-300">
            {products.length}
          </span>{' '}
          of{' '}
          <span className="font-medium text-green-700 dark:text-green-300">
            {total}
          </span>{' '}
          products
          {currentSearch && (
            <>
              {' '}
              for &ldquo;
              <span className="font-medium text-green-700 dark:text-green-300">
                {currentSearch}
              </span>
              &rdquo;
            </>
          )}
        </p>

        {products.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => {
              const primaryImage = product.images[0]
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
                          <Package className="h-12 w-12 text-green-300 dark:text-green-700" />
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
                      {product.stock > 0 && product.stock < 10 && (
                        <div className="absolute right-3 top-3">
                          <Badge variant="gold">Low Stock</Badge>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="mb-1 font-semibold text-brown-800 transition-colors group-hover:text-green-700 dark:text-cream-100 dark:group-hover:text-green-400">
                        {product.name}
                      </h3>
                      <p className="mb-2 text-xs text-green-500 dark:text-green-500">
                        {product.origin && `Origin: ${product.origin}`}
                        {product.weight && `  •  ${product.weight}`}
                      </p>
                      <p className="text-lg font-bold text-green-700 dark:text-green-400">
                        {formatPrice(product.price)}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-green-300 bg-green-50/50 p-16 text-center dark:border-green-700 dark:bg-green-900/20">
            <Search className="mx-auto mb-4 h-12 w-12 text-green-400" />
            <h3 className="mb-2 text-xl font-semibold text-brown-800 dark:text-cream-100">
              No Products Found
            </h3>
            <p className="mb-4 text-green-600 dark:text-green-400">
              Try adjusting your search or filter criteria.
            </p>
            <Link href="/products">
              <Button variant="outline">Clear All Filters</Button>
            </Link>
          </div>
        )}

        {/* ═══════════════ Pagination ═══════════════ */}
        {totalPages > 1 && (
          <nav
            className="mt-12 flex items-center justify-center gap-2"
            aria-label="Pagination"
          >
            {/* Previous */}
            {currentPage > 1 ? (
              <Link
                href={buildUrl({ page: String(currentPage - 1) })}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-green-300 text-green-700 transition-colors hover:bg-green-50 dark:border-green-700 dark:text-green-300 dark:hover:bg-green-900"
              >
                <ChevronLeft className="h-4 w-4" />
              </Link>
            ) : (
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-green-200 text-green-300 dark:border-green-800 dark:text-green-700">
                <ChevronLeft className="h-4 w-4" />
              </span>
            )}

            {/* Pages */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (page) => (
                <Link
                  key={page}
                  href={buildUrl({ page: String(page) })}
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                    page === currentPage
                      ? 'bg-green-700 text-white'
                      : 'border border-green-300 text-green-700 hover:bg-green-50 dark:border-green-700 dark:text-green-300 dark:hover:bg-green-900'
                  }`}
                >
                  {page}
                </Link>
              ),
            )}

            {/* Next */}
            {currentPage < totalPages ? (
              <Link
                href={buildUrl({ page: String(currentPage + 1) })}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-green-300 text-green-700 transition-colors hover:bg-green-50 dark:border-green-700 dark:text-green-300 dark:hover:bg-green-900"
              >
                <ChevronRight className="h-4 w-4" />
              </Link>
            ) : (
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-green-200 text-green-300 dark:border-green-800 dark:text-green-700">
                <ChevronRight className="h-4 w-4" />
              </span>
            )}
          </nav>
        )}
      </section>
    </div>
  )
}
