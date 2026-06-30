import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: Request) {
  try {
    const { images } = await req.json()

    if (!images || !Array.isArray(images)) {
      return NextResponse.json(
        { error: 'Images array is required' },
        { status: 400 }
      )
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const uploadBase64 = async (base64Str: string, index: number) => {
      if (!base64Str.startsWith('data:image')) return base64Str;
      const matches = base64Str.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) return base64Str;
      const buffer = Buffer.from(matches[2], 'base64');
      const path = `bookings/booking_img_${Date.now()}_${index}.jpg`
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

    const urls = []
    for (let i = 0; i < images.length; i++) {
      const url = await uploadBase64(images[i], i)
      if (url && url.startsWith('http')) {
        urls.push(url)
      }
    }

    return NextResponse.json({ success: true, urls })
  } catch (error) {
    console.error('Upload Images Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
