'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, Pencil, Home, Briefcase, MapPin } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { PageHeader } from '@/components/ui/PageHeader'
import { SubPageLayout } from '@/components/ui/SubPageLayout'

interface Address {
  id: string
  type: 'home' | 'work' | 'other'
  label: string | null
  city: string
  street: string
  building: string | null
  apartment: string | null
  notes: string | null
}

const typeIcons: Record<string, typeof Home> = { home: Home, work: Briefcase, other: MapPin }
const typeLabels: Record<string, string> = { home: 'المنزل', work: 'العمل', other: 'أخرى' }

export default function SavedAddressesPage() {
  const supabase = createClient()
  const { profile } = useAuth()
  const router = useRouter()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAddresses = async () => {
    if (!profile?.id) return
    const { data } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', profile.id)
      .order('created_at', { ascending: false })
    if (data) setAddresses(data)
    setLoading(false)
  }

  useEffect(() => { fetchAddresses() }, [profile])

  const handleDelete = async (id: string) => {
    const ok = confirm('هل أنت متأكد من حذف هذا العنوان؟')
    if (!ok) return
    await supabase.from('addresses').delete().eq('id', id)
    setAddresses(prev => prev.filter(a => a.id !== id))
  }

  return (
    <SubPageLayout>
      <PageHeader title="العناوين المحفوظة" />

      <div className="px-6 pb-32">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#FF8A00] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : addresses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-[#1E2538] flex items-center justify-center mb-4">
              <MapPin size={28} className="text-[#6B7A99]" />
            </div>
            <p className="text-[#6B7A99] text-sm">لا توجد عناوين محفوظة</p>
            <p className="text-[#4B5A7A] text-xs mt-1">أضف عنواناً جديداً ليسهل عليك الطلب</p>
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {addresses.map((addr) => {
              const Icon = typeIcons[addr.type] || MapPin
              return (
                <div key={addr.id} className="bg-[#0A0D1A] rounded-2xl p-4 border border-white/5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#1E2538] flex items-center justify-center shrink-0 mt-1">
                      <Icon size={18} className="text-[#FF8A00]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-bold">{typeLabels[addr.type]}</h3>
                        {addr.label && (
                          <span className="text-[10px] text-[#6B7A99] bg-[#1E2538] px-2 py-0.5 rounded-full">{addr.label}</span>
                        )}
                      </div>
                      <p className="text-sm text-[#6B7A99] leading-relaxed">
                        {addr.street}{addr.building ? `، ${addr.building}` : ''}{addr.apartment ? `، شقة ${addr.apartment}` : ''}
                      </p>
                      <p className="text-xs text-[#4B5A7A] mt-0.5">{addr.city}</p>
                      {addr.notes && <p className="text-xs text-[#4B5A7A] mt-1 italic">{addr.notes}</p>}
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                      <button onClick={() => router.push(`/client/addresses/edit/${addr.id}`)} className="w-8 h-8 rounded-xl bg-[#1E2538] flex items-center justify-center hover:bg-[#2A3550] transition-colors">
                        <Pencil size={14} className="text-[#FFB800]" />
                      </button>
                      <button onClick={() => handleDelete(addr.id)} className="w-8 h-8 rounded-xl bg-[#1E2538] flex items-center justify-center hover:bg-[#2A3550] transition-colors">
                        <Trash2 size={14} className="text-[#EF4444]" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <button
          onClick={() => router.push('/client/addresses/new')}
          className="w-full mt-6 py-4 rounded-2xl bg-gradient-to-l from-[#FF8A00] to-[#FFB800] text-[#050814] font-bold text-base shadow-lg shadow-[#FF8A00]/20 hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          إضافة عنوان جديد
        </button>
      </div>
    </SubPageLayout>
  )
}
