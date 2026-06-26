import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/admin/dashboard - Dashboard stats
export async function GET() {
  try {
    const [
      totalProducts,
      totalCategories,
      totalOrders,
      lowStock,
      recentOrders,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.order.count(),
      prisma.product.findMany({
        where: { stock: { lte: 10 }, status: 'active' },
        include: { category: true },
        orderBy: { stock: 'asc' },
        take: 10,
      }),
      prisma.order.findMany({
        include: {
          items: {
            include: {
              product: {
                select: { id: true, name: true, price: true },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    ])

    // Calculate total revenue from all orders (not just recent)
    const allOrders = await prisma.order.findMany({
      select: { subtotal: true },
    })
    const totalRevenue = allOrders.reduce((sum, o) => sum + o.subtotal, 0)

    return NextResponse.json({
      totalProducts,
      totalCategories,
      totalOrders,
      totalRevenue,
      lowStock,
      recentOrders,
    })
  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    )
  }
}
