import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import nodemailer from 'nodemailer'

export async function POST(req: Request) {
  try {
    const { email, password, data } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const uploadBase64 = async (base64Str: string | null | undefined, path: string) => {
      if (!base64Str || !base64Str.startsWith('data:image')) return base64Str;
      const matches = base64Str.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) return base64Str;
      const buffer = Buffer.from(matches[2], 'base64');
      const { error } = await supabase.storage.from('avatars').upload(path, buffer, {
        contentType: matches[1],
        upsert: true
      });
      if (error) {
        console.error('Upload error:', error);
        return null;
      }
      const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(path);
      return publicUrlData.publicUrl;
    }

    if (data) {
      const ts = Date.now()
      if (data.avatar_url) data.avatar_url = await uploadBase64(data.avatar_url, `${email}/avatar_${ts}.jpg`)
      if (data.id_front_url) data.id_front_url = await uploadBase64(data.id_front_url, `${email}/id_front_${ts}.jpg`)
      if (data.id_back_url) data.id_back_url = await uploadBase64(data.id_back_url, `${email}/id_back_${ts}.jpg`)
      if (data.portfolio_urls && Array.isArray(data.portfolio_urls)) {
        const newPortfolio = []
        for (let i = 0; i < data.portfolio_urls.length; i++) {
          const url = await uploadBase64(data.portfolio_urls[i], `${email}/portfolio_${ts}_${i}.jpg`)
          if (url) newPortfolio.push(url)
        }
        data.portfolio_urls = newPortfolio.length > 0 ? newPortfolio : null
      }
    }

    const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
      type: 'signup',
      email,
      password,
      options: { data }
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
        { error: 'Failed to generate OTP' },
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
      subject: 'رمز التحقق من حسابك في حِرفة',
      text: `مرحباً بك في حِرفة\n\nرمز التحقق الخاص بك هو: ${otp}\n\nهذا الرمز صالح لمدة محدودة. الرجاء عدم مشاركته مع أي شخص.`,
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
          <h1 style="color: #FF8A00;">مرحباً بك في حِرفة</h1>
          <p style="font-size: 16px; color: #333;">رمز التحقق الخاص بك هو:</p>
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
    console.error('Send OTP Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
