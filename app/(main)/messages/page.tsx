'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MessageSquare } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'

export default function MessagesPage() {
  const { profile } = useAuth()
  const supabase = createClient()
  const [conversations, setConversations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (profile) fetchConversations()
  }, [profile])

  const fetchConversations = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('conversations')
      .select('*, client:client_id(*)')
      .eq('worker_id', profile?.id)
      .order('last_message_at', { ascending: false })
    
    if (data) setConversations(data)
    setLoading(false)
  }

  return (
    <div dir="rtl" className="min-h-screen bg-[#050814] text-white px-4 py-6 mb-2">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-full bg-[#FF8A00]/10 flex items-center justify-center text-[#FF8A00]">
          <MessageSquare size={20} />
        </div>
        <h1 className="text-xl font-bold">المحادثات</h1>
      </div>

      <div className="flex flex-col gap-3">
        {loading ? (
          <div className="text-center py-10 text-[#6B7A99] text-xs">جاري التحميل...</div>
        ) : conversations.length > 0 ? (
          conversations.map((conv) => (
            <Link href={`/messages/${conv.id}`} key={conv.id} className="bg-[#0A0D1A] rounded-2xl p-4 border border-white/5 flex items-center gap-4 hover:bg-[#0F1322] transition-colors">
              <div className="relative shrink-0">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#1E2538] bg-[#1E2538]">
                  <Image src={conv.client?.avatar_url || "/client_avatar.png"} alt="Client" fill className="object-cover" />
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#4ADE80] rounded-full border-2 border-[#0A0D1A]" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-sm truncate">{conv.client?.full_name || 'عميل'}</h3>
                  <span className="text-[10px] text-[#6B7A99] shrink-0">
                    {new Date(conv.last_message_at).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-xs text-[#94A3B8] truncate">
                  {conv.last_message || 'ابدأ المحادثة الآن...'}
                </p>
              </div>
            </Link>
          ))
        ) : (
          <div className="bg-[#0A0D1A] rounded-2xl p-10 flex flex-col items-center justify-center border border-white/5 text-[#6B7A99]">
            <MessageSquare size={32} className="mb-3 opacity-50" />
            <span className="text-xs">لا توجد محادثات حالياً</span>
          </div>
        )}
      </div>
    </div>
  )
}
