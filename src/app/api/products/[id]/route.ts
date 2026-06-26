import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/products/[id] - Single product with images
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: {
          orderBy: { isPrimary: 'desc' },
        },
      },
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

// PUT /api/products/[id] - Update product
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const existing = await prisma.product.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    const {
      name,
      slug,
      description,
      price,
      weight,
      origin,
      benefits,
      stock,
      sku,
      status,
      categoryId,
      images,
    } = body

    // If images are provided, delete existing and recreate
    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(slug !== undefined && { slug }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price: Number(price) }),
        ...(weight !== undefined && { weight }),
        ...(origin !== undefined && { origin }),
        ...(benefits !== undefined && { benefits }),
        ...(stock !== undefined && { stock: Number(stock) }),
        ...(sku !== undefined && { sku }),
        ...(status !== undefined && { status }),
        ...(categoryId !== undefined && { categoryId }),
      },
      include: {
        category: true,
        images: {
          orderBy: { isPrimary: 'desc' },
        },
      },
    })

    // Handle image updates separately if provided
    if (images && Array.isArray(images)) {
      await prisma.productImage.deleteMany({ where: { productId: id } })
      if (images.length > 0) {
        await prisma.productImage.createMany({
          data: images.map(
            (img: { url: string; alt?: string; isPrimary?: boolean }, idx: number) => ({
              url: img.url,
              alt: img.alt || null,
              isPrimary: idx === 0,
              productId: id,
            })
          ),
        })
      }
      // Re-fetch with updated images
      const updated = await prisma.product.findUnique({
        where: { id },
        include: {
          category: true,
          images: { orderBy: { isPrimary: 'desc' } },
        },
      })
      return NextResponse.json(updated)
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

// DELETE /api/products/[id] - Delete product
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const existing = await prisma.product.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    await prisma.product.delete({ where: { id } })

    return NextResponse.json({ message: 'Product deleted successfully' })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}
