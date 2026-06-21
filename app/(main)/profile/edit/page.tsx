'use client'

import { PageHeader } from '@/components/ui/PageHeader'
import { SubPageLayout } from '@/components/ui/SubPageLayout'
import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Camera, User, Phone, MapPin, Briefcase } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { FormInput } from '@/components/ui/forms/FormInput'

export default function EditProfilePage() {
  const router = useRouter()
  const { profile } = useAuth()
  const supabase = createClient()
  
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [governorate, setGovernorate] = useState('')
  const [area, setArea] = useState('')
  const [profession, setProfession] = useState('')
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (profile) {
      setName(profile.full_name || '')
      setPhone(profile.phone || '')
      setGovernorate(profile.governorate || '')
      setArea(profile.area || '')
      setProfession(profile.profession || '')
      setAvatarPreview(profile.avatar_url || null)
    }
  }, [profile])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return
    setLoading(true)

    await supabase.from('profiles').update({
      full_name: name,
      phone: phone,
      governorate: governorate,
      area: area,
      profession: profession,
      avatar_url: avatarPreview
    }).eq('id', profile.id)

    setLoading(false)
    router.push('/profile')
    router.refresh()
  }

  return (
    <SubPageLayout>
      <PageHeader title="تعديل الملف الشخصي" isTransparent />

      <form onSubmit={handleSave} className="flex flex-col gap-6 px-6 pt-4">
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-28 h-28 mb-4">
            <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-[#1E2538] bg-[#1E2538]">
              {avatarPreview ? (
                <Image src={avatarPreview} alt="Preview" fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#6B7A99]">
                  <User size={40} />
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 w-8 h-8 bg-[#FF8A00] rounded-full flex items-center justify-center border-2 border-[#050814] text-[#050814] hover:bg-[#FFB800] transition-colors shadow-lg"
            >
              <Camera size={14} />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
          </div>
          <span className="text-xs text-[#6B7A99]">اضغط على أيقونة الكاميرا لتغيير الصورة</span>
        </div>

        <div className="flex flex-col gap-5">
          <FormInput 
            label="الاسم الكامل" 
            icon={<User size={18} />} 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="أدخل اسمك الكامل" 
            required 
          />
          <FormInput 
            label="المهنة / التخصص" 
            icon={<Briefcase size={18} />} 
            value={profession} 
            onChange={(e) => setProfession(e.target.value)} 
            placeholder="مثل: نجار، كهربائي، سباك..." 
          />
          <FormInput 
            label="رقم الهاتف" 
            icon={<Phone size={18} />} 
            type="tel" 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)} 
            placeholder="01xxxxxxxxx" 
            dir="ltr"
            className="text-right"
          />

          <div className="grid grid-cols-2 gap-4">
            <FormInput 
              label="المحافظة" 
              icon={<MapPin size={16} />} 
              value={governorate} 
              onChange={(e) => setGovernorate(e.target.value)} 
              placeholder="المحافظة" 
            />
            <FormInput 
              label="المنطقة / الحي" 
              value={area} 
              onChange={(e) => setArea(e.target.value)} 
              placeholder="المنطقة" 
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-[#FF8A00] to-[#FFB800] text-[#050814] font-bold rounded-2xl py-4 mt-6 shadow-[0_4px_20px_rgba(255,138,0,0.3)] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
        >
          {loading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
        </button>
      </form>
    </SubPageLayout>
  )
}
