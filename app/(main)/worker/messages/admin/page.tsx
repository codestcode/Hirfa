'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { MessageSquare } from 'lucide-react'
import { SubPageLayout } from '@/components/ui/SubPageLayout'

export default function WorkerAdminMessagesPage() {
  const { profile } = useAuth()
  const supabase = createClient()
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchMessages = useCallback(async () => {
    if (!profile) return
    setLoading(true)
    const { data } = await supabase
      .from('admin_messages')
      .select('*, sender:sender_id(full_name, email, avatar_url)')
      .eq('receiver_id', profile.id)
      .is('booking_id', null)
      .order('created_at', { ascending: false })
    if (data) setMessages(data)
    setLoading(false)
  }, [profile, supabase])

  useEffect(() => {
    fetchMessages()
  }, [fetchMessages])

  const markAsRead = async (messageId: string) => {
    await supabase.from('admin_messages').update({ is_read: true }).eq('id', messageId)
    fetchMessages()
  }

  return (
    <SubPageLayout>
      <div className="px-4 py-6 mb-2">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-[#FF8A00]/10 flex items-center justify-center text-[#FF8A00]">
            <MessageSquare size={20} />
          </div>
          <h1 className="text-xl font-bold">رسائل الإدارة</h1>
        </div>

        <div className="flex flex-col gap-3">
          {loading ? (
            <div className="text-center text-[#6B7A99]">جاري التحميل...</div>
          ) : messages.length ? (
            messages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => !msg.is_read && markAsRead(msg.id)}
                className={`bg-[#0A0D1A] rounded-2xl p-4 border cursor-pointer transition-all ${
                  msg.is_read ? 'border-white/5' : 'border-[#FF8A00]/30 bg-[#1A1410]'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">{msg.sender?.full_name || 'الأدمن'}</span>
                    {!msg.is_read && (
                      <span className="w-2 h-2 bg-[#FF8A00] rounded-full" />
                    )}
                  </div>
                  <span className="text-[10px] text-[#6B7A99]">
                    {new Date(msg.created_at).toLocaleDateString('ar-EG')}
                  </span>
                </div>
                <p className="text-xs text-white leading-relaxed">{msg.text}</p>
              </div>
            ))
          ) : (
            <div className="bg-[#0A0D1A] rounded-2xl p-10 flex flex-col items-center justify-center border border-white/5 text-[#6B7A99]">
              <MessageSquare size={32} className="mb-3 opacity-50" />
              <span className="text-xs">لا توجد رسائل من الإدارة حالياً</span>
            </div>
          )}
        </div>
      </div>
    </SubPageLayout>
  )
}
