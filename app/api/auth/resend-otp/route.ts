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

    const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email,
    })

    if (linkError) {
      return NextResponse.json(
        { error: linkError.message },
        { status: 400 }
      )
    }

    const otp = linkData.properties?.email_otp

    if (!otp) {
      return NextResponse.json(
        { error: 'Failed to generate new OTP' },
        { status: 500 }
      )
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
      subject: 'رمز التحقق الجديد من حسابك في حِرفة',
      text: `مرحباً بك في حِرفة\n\nرمز التحقق الجديد الخاص بك هو: ${otp}\n\nهذا الرمز صالح لمدة محدودة. الرجاء عدم مشاركته مع أي شخص.`,
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
          <h1 style="color: #FF8A00;">مرحباً بك في حِرفة</h1>
          <p style="font-size: 16px; color: #333;">رمز التحقق الجديد الخاص بك هو:</p>
          <div style="font-size: 32px; font-weight: bold; margin: 20px 0; letter-spacing: 5px; color: #000;">
            ${otp}
          </div>
          <p style="font-size: 14px; color: #666;">
            هذا الرمز صالح لمدة محدودة. الرجاء عدم مشاركته مع أي شخص.
          </p>
        </div>
      `
    }

    await transporter.sendMail(mailOptions)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Resend OTP Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
