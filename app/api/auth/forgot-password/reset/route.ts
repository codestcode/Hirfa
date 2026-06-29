import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: Request) {
  try {
    const { email, token, password } = await req.json()

    if (!email || !token || !password) {
      return NextResponse.json(
        { error: 'جميع الحقول مطلوبة' },
        { status: 400 }
      )
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: record, error: recordErr } = await supabase
      .from('password_reset_otps')
      .select('id, expires_at, used')
      .eq('id', token)
      .eq('email', email)
      .eq('used', false)
      .maybeSingle()

    if (recordErr || !record) {
      return NextResponse.json(
        { error: 'طلب إعادة تعيين غير صالح أو منتهي الصلاحية' },
        { status: 400 }
      )
    }

    const isExpired = new Date(record.expires_at).getTime() < Date.now()
    if (isExpired) {
      return NextResponse.json(
        { error: 'طلب إعادة التعيين منتهي الصلاحية' },
        { status: 400 }
      )
    }

    const { data: profile, error: profErr } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle()

    if (profErr || !profile) {
      return NextResponse.json(
        { error: 'المستخدم غير موجود' },
        { status: 404 }
      )
    }

    // Securely update the user's password via Supabase Auth Admin API
    const { error: authErr } = await supabase.auth.admin.updateUserById(
      profile.id,
      { password: password }
    )

    if (authErr) {
      return NextResponse.json(
        { error: 'فشل تحديث كلمة المرور: ' + authErr.message },
        { status: 400 }
      )
    }

    // Invalidate the OTP to prevent reuse
    await supabase
      .from('password_reset_otps')
      .update({ used: true })
      .eq('id', token)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Reset Password Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
