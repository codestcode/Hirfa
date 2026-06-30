'use client'

import React from 'react'
import { MessageSquare, Shield } from 'lucide-react'
import { useMessages } from '@/hooks/useMessages'
import { PageLoader } from '@/components/ui/PageLoader'
import { ConversationCard } from '@/components/ui/messages/ConversationCard'
import Link from 'next/link'

export default function MessagesPage() {
  const { conversations, loading } = useMessages()

  return (
    <div dir="rtl" className="min-h-screen bg-[#050814] text-white px-4 py-6 mb-2">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-full bg-[#FF8A00]/10 flex items-center justify-center text-[#FF8A00]">
          <MessageSquare size={20} />
        </div>
        <h1 className="text-xl font-bold">المحادثات</h1>
      </div>

      {/* Admin Messages Link */}
      <Link
        href="/worker/messages/admin"
        className="bg-gradient-to-r from-[#FF8A00]/10 to-[#FFB800]/10 rounded-2xl p-4 border border-[#FF8A00]/30 mb-6 flex items-center gap-3 hover:bg-[#FF8A00]/20 transition-colors"
      >
        <div className="w-10 h-10 rounded-full bg-[#FF8A00]/20 flex items-center justify-center text-[#FF8A00]">
          <Shield size={18} />
        </div>
        <div className="flex-1">
          <div className="text-sm font-bold text-white">رسائل الإدارة</div>
          <div className="text-[10px] text-[#6B7A99]">الرسائل من فريق الدعم</div>
        </div>
      </Link>

      <div className="flex flex-col gap-3">
        {loading ? <PageLoader /> : conversations.length ? conversations.map((conv) => (
          <ConversationCard
            key={conv.id}
            id={conv.id}
            clientId={conv.client_id}
            clientName={conv.client?.full_name || 'عميل'}
            clientAvatar={conv.client?.avatar_url}
            lastMessage={conv.last_message}
            lastMessageAt={conv.last_message_at}
            basePath="/worker/messages"
          />
        )) : (
          <div className="bg-[#0A0D1A] rounded-2xl p-10 flex flex-col items-center justify-center border border-white/5 text-[#6B7A99]">
            <MessageSquare size={32} className="mb-3 opacity-50" />
            <span className="text-xs">لا توجد محادثات حالياً</span>
          </div>
        )}
      </div>
    </div>
  )
}
