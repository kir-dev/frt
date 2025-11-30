import config from '@/payload.config'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'

export async function GET() {
  try {
    const payload = await getPayload({ config })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const settings = await (payload.findGlobal as any)({
      slug: 'site-settings',
    })

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error fetching site settings:', error)
    return NextResponse.json(
      { showAssociationPage: true, showRecruitmentPage: true },
      { status: 500 }
    )
  }
}
