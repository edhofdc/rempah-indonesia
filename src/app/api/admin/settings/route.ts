import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/admin/settings - Get all settings
export async function GET() {
  try {
    const settings = await prisma.setting.findMany()
    const companyProfile = await prisma.companyProfile.findUnique({
      where: { id: 'main' },
    })

    // Convert settings array to key-value map
    const settingsMap: Record<string, string> = {}
    for (const s of settings) {
      settingsMap[s.key] = s.value
    }

    return NextResponse.json({
      settings: settingsMap,
      companyProfile,
    })
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/settings - Update settings
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    // Handle individual setting updates (key-value)
    if (body.key && body.value !== undefined) {
      await prisma.setting.upsert({
        where: { key: body.key },
        update: { value: String(body.value) },
        create: { key: body.key, value: String(body.value) },
      })

      return NextResponse.json({ success: true })
    }

    // Handle company profile update
    if (body.companyProfile) {
      const cp = body.companyProfile
      await prisma.companyProfile.upsert({
        where: { id: 'main' },
        update: {
          companyName: cp.companyName,
          tagline: cp.tagline,
          description: cp.description,
          vision: cp.vision,
          mission: cp.mission,
          address: cp.address,
          phone: cp.phone,
          email: cp.email,
          whatsapp: cp.whatsapp,
        },
        create: {
          id: 'main',
          companyName: cp.companyName || 'Rempah Indonesia',
          tagline: cp.tagline || '',
          description: cp.description || '',
          address: cp.address || '',
          phone: cp.phone || '',
          email: cp.email || '',
          whatsapp: cp.whatsapp || '',
        },
      })

      return NextResponse.json({ success: true })
    }

    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}
