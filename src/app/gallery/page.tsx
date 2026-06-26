import Image from 'next/image'
import { prisma } from '@/lib/db'
import { Badge } from '@/components/ui/badge'
import { Camera, Filter } from 'lucide-react'

// ─── Data fetching ──────────────────────────────────────────────

async function getGalleryImages() {
  const images = await prisma.galleryImage.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return images
}

// ─── Gallery Page ───────────────────────────────────────────────

export default async function GalleryPage() {
  const images = await getGalleryImages()

  // Get unique categories
  const categories = [
    ...new Set(images.map((img) => img.category).filter(Boolean)),
  ] as string[]

  return (
    <div className="min-h-screen">
      {/* ═══════════════ Hero ═══════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-900 via-green-800 to-green-950 py-24 md:py-32">
        <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <Badge variant="secondary" className="mb-4">
            Gallery
          </Badge>
          <h1 className="mb-6 text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
            Our Gallery
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-green-200">
            A visual journey through the world of Indonesian spices — from lush
            farms to your table.
          </p>
        </div>
      </section>

      {/* ═══════════════ Gallery Grid ═══════════════ */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {images.length > 0 ? (
            <>
              {/* Category filters */}
              {categories.length > 0 && (
                <div className="mb-8 flex flex-wrap items-center gap-2">
                  <Filter className="h-4 w-4 text-green-500" />
                  <span className="rounded-full bg-green-700 px-3 py-1 text-xs font-medium text-white">
                    All
                  </span>
                  {categories.map((cat) => (
                    <span
                      key={cat}
                      className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 transition-colors hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              )}

              {/* Image grid */}
              <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
                {images.map((img) => (
                  <div
                    key={img.id}
                    className="group relative mb-4 overflow-hidden rounded-2xl break-inside-avoid"
                  >
                    <Image
                      src={img.url}
                      alt={img.alt ?? 'Gallery image'}
                      width={800}
                      height={600}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />

                    {/* Overlay on hover */}
                    <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-transparent to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
                      {img.caption && (
                        <p className="text-sm font-medium text-white">
                          {img.caption}
                        </p>
                      )}
                      {img.category && (
                        <Badge
                          variant="secondary"
                          className="mt-1 self-start"
                        >
                          {img.category}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-green-300 bg-green-50/50 p-16 text-center dark:border-green-700 dark:bg-green-900/20">
              <Camera className="mx-auto mb-4 h-16 w-16 text-green-400" />
              <h2 className="mb-2 text-2xl font-semibold text-brown-800 dark:text-cream-100">
                Gallery Coming Soon
              </h2>
              <p className="text-green-600 dark:text-green-400">
                We&apos;re gathering photos from our farms and partners. Check
                back soon for a visual tour of Indonesian spice heritage!
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
