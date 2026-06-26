import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

function generateOrderNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const random = Math.floor(1000 + Math.random() * 9000);
  return `INV-${year}${month}${day}-${random}`;
}

// POST /api/orders - Create order from checkout
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerName, phone, email, address, notes, items } = body;

    // Validate required fields
    if (
      !customerName ||
      !phone ||
      !address ||
      !items ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: customerName, phone, address, and items (non-empty array)",
        },
        { status: 400 },
      );
    }

    // Validate and fetch product prices
    const productIds = items.map(
      (item: { productId: string }) => item.productId,
    );
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    if (products.length !== productIds.length) {
      return NextResponse.json(
        { error: "One or more products not found" },
        { status: 400 },
      );
    }

    const productMap = new Map(products.map((p) => [p.id, p]));

    // Calculate subtotal and build order items
    let subtotal = 0;
    const orderItemsData = items.map(
      (item: { productId: string; quantity: number }) => {
        const product = productMap.get(item.productId);
        if (!product) {
          throw new Error(`Product ${item.productId} not found`);
        }
        const quantity = Number(item.quantity) || 1;
        const lineTotal = product.price * quantity;
        subtotal += lineTotal;
        return {
          productId: item.productId,
          quantity,
          price: product.price,
        };
      },
    );

    // Generate unique order number (retry on collision)
    let orderNumber = generateOrderNumber();
    let attempts = 0;
    while (attempts < 5) {
      const existing = await prisma.order.findUnique({
        where: { orderNumber },
      });
      if (!existing) break;
      orderNumber = generateOrderNumber();
      attempts++;
    }

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName,
        phone,
        email: email || null,
        address,
        notes: notes || null,
        subtotal,
        status: "pending",
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                price: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 },
    );
  }
}
