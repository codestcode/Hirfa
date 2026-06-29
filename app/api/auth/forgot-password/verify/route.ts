import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json()

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required' },
        { status: 400 }
      )
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: record, error } = await supabase
      .from('password_reset_otps')
      .select('id, expires_at, used')
      .eq('email', email)
      .eq('otp', otp.trim())
      .eq('used', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error || !record) {
      return NextResponse.json(
        { error: 'الرمز المدخل غير صحيح' },
        { status: 400 }
      )
    }

    const isExpired = new Date(record.expires_at).getTime() < Date.now()
    if (isExpired) {
      return NextResponse.json(
        { error: 'الرمز منتهي الصلاحية' },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true, token: record.id })
  } catch (error) {
    console.error('Verify OTP Reset Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
