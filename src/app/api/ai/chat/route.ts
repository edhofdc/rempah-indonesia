import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// POST /api/ai/chat - AI chat that returns product recommendations
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message } = body

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      )
    }

    // Extract keywords from the message (lowercase, remove punctuation)
    const keywords = message
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter((w) => w.length > 2)
      .filter(
        (w) =>
          ![
            'the',
            'and',
            'for',
            'are',
            'you',
            'can',
            'what',
            'with',
            'this',
            'that',
            'from',
            'have',
            'like',
            'some',
            'your',
            'about',
            'which',
            'tell',
            'need',
            'want',
            'know',
            'help',
            'looking',
            'recommend',
            'recommendation',
            'product',
            'products',
            'spice',
            'spices',
            'herb',
            'herbs',
            'indonesian',
            'rempah',
          ].includes(w)
      )

    // If no meaningful keywords, return all active products
    let products
    if (keywords.length === 0) {
      products = await prisma.product.findMany({
        where: { status: 'active' },
        include: {
          category: true,
          images: {
            where: { isPrimary: true },
            take: 1,
          },
        },
        take: 5,
        orderBy: { createdAt: 'desc' },
      })
    } else {
      // Search products by name/description matching keywords
      const orConditions = keywords.map((keyword: string) => ({
        OR: [
          { name: { contains: keyword } },
          { description: { contains: keyword } },
          { benefits: { contains: keyword } },
        ],
      }))

      products = await prisma.product.findMany({
        where: {
          status: 'active',
          AND: [{ OR: orConditions }],
        },
        include: {
          category: true,
          images: {
            where: { isPrimary: true },
            take: 1,
          },
        },
        take: 5,
        orderBy: { createdAt: 'desc' },
      })
    }

    // Build AI response text
    if (products.length === 0) {
      return NextResponse.json({
        message:
          "Maaf, saya tidak menemukan produk yang sesuai dengan pencarian Anda. Kami memiliki berbagai rempah dan bumbu Indonesia berkualitas. Coba cari dengan kata kunci lain seperti: lada, kayu manis, cengkeh, pala, jahe, kunyit, atau kunjungi katalog produk kami.",
        products: [],
      })
    }

    const productList = products
      .map(
        (p) =>
          `• *${p.name}* - Rp${p.price.toLocaleString('id-ID')} - ${p.description.substring(0, 100)}${p.description.length > 100 ? '...' : ''}`
      )
      .join('\n')

    const responseText = `Saya menemukan beberapa produk yang mungkin Anda cari:\n\n${productList}\n\nUntuk informasi lebih lanjut atau pemesanan, silakan hubungi kami melalui WhatsApp atau kunjungi halaman produk kami.`

    return NextResponse.json({
      message: responseText,
      products: products.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.price,
        description: p.description,
        category: p.category.name,
        image: p.images[0]?.url || null,
      })),
    })
  } catch (error) {
    console.error('Error in AI chat:', error)
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    )
  }
}
