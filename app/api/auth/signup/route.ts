import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, fullName, phone, role, governorate, area } = body

    const supabase = await createClient()

    const { data: authData, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          email,
          phone: phone ?? null,
          role,
          governorate: governorate ?? null,
          area: area ?? null,
        },
      },
    })

    if (error) {
      console.error('[API signup] Supabase error:', error)
      if (error.code === 'over_email_send_rate_limit') {
        return NextResponse.json({ error: 'لقد تجاوزت الحد المسموح به. الرجاء الانتظار بضع دقائق قبل المحاولة مرة أخرى.' }, { status: 429 })
      }
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ error: null })
  } catch (err: any) {
    console.error('[API signup] Unexpected error:', err)
    return NextResponse.json({ error: err?.message || 'حدث خطأ غير متوقع' }, { status: 500 })
  }
}
