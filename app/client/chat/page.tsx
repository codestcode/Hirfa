'use client'

import React, { useEffect, useState } from 'react'
import { MessageSquare } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { PageLoader } from '@/components/ui/PageLoader'
import { ConversationCard } from '@/components/ui/messages/ConversationCard'

export default function ClientChatPage() {
  const { profile } = useAuth()
  const supabase = createClient()
  const [conversations, setConversations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile?.id) return

    const fetchConversations = async () => {
      const { data } = await supabase
        .from('conversations')
        .select('*, worker:worker_id(full_name, avatar_url, profession)')
        .eq('client_id', profile.id)
        .order('last_message_at', { ascending: false })
      
      if (data) setConversations(data)
      setLoading(false)
    }

    fetchConversations()

    const channel = supabase
      .channel(`client-conversations-${profile.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'conversations', filter: `client_id=eq.${profile.id}` },
        () => fetchConversations()
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [profile?.id, supabase])

  return (
    <div dir="rtl" className="min-h-screen bg-[#050814] text-white px-4 py-6 pb-24">
      <div className="flex items-center gap-3 mb-8 pt-4">
        <div className="w-10 h-10 rounded-full bg-[#FF8A00]/10 flex items-center justify-center text-[#FF8A00]">
          <MessageSquare size={20} />
        </div>
        <h1 className="text-xl font-bold">المحادثات</h1>
      </div>

      <div className="flex flex-col gap-3">
        {loading ? <PageLoader /> : conversations.length ? conversations.map((conv) => (
          <ConversationCard
            key={conv.id}
            id={conv.id}
            clientId={conv.worker_id}
            clientName={conv.worker?.full_name || 'حرفي'}
            clientAvatar={conv.worker?.avatar_url}
            lastMessage={conv.last_message}
            lastMessageAt={conv.last_message_at}
            basePath="/client/chat"
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
