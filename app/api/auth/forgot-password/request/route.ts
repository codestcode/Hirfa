import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import nodemailer from 'nodemailer'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle()

    if (!profile) {
      return NextResponse.json({ success: true })
    }

    const { data: existing } = await supabase
      .from('password_reset_otps')
      .select('created_at')
      .eq('email', email)
      .eq('used', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (existing) {
      const timeDiff = Date.now() - new Date(existing.created_at).getTime()
      if (timeDiff < 60000) {
        return NextResponse.json(
          { error: 'الرجاء الانتظار دقيقة قبل طلب رمز جديد' },
          { status: 429 }
        )
      }
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expires_at = new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10 mins

    const { error: insertErr } = await supabase
      .from('password_reset_otps')
      .insert({
        email,
        otp,
        expires_at
      })

    if (insertErr) {
      throw insertErr
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.ethereal.email',
      port: Number(process.env.SMTP_PORT) || 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    })

    const mailOptions = {
      from: process.env.SMTP_FROM || 'noreply@hirfa.com',
      to: email,
      subject: 'رمز إعادة تعيين كلمة المرور - حِرفة',
      text: `رمز التحقق الخاص بك لإعادة تعيين كلمة المرور هو: ${otp}\n\nهذا الرمز صالح لمدة 10 دقائق.`,
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
          <h1 style="color: #FF8A00;">إعادة تعيين كلمة المرور</h1>
          <p style="font-size: 16px; color: #333;">رمز التحقق الخاص بك لإعادة تعيين كلمة المرور هو:</p>
          <div style="font-size: 32px; font-weight: bold; margin: 20px 0; letter-spacing: 5px; color: #000;">
            ${otp}
          </div>
          <p style="font-size: 14px; color: #666;">
            هذا الرمز صالح لمدة 10 دقائق. الرجاء عدم مشاركته مع أي شخص.
          </p>
        </div>
      `
    }

    await transporter.sendMail(mailOptions)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Request Reset OTP Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
