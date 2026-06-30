'use client'

import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import { useChatRoom } from '@/hooks/useChatRoom'
import { ChatBubble } from '@/components/ui/messages/ChatBubble'
import { ChatInput } from '@/components/ui/messages/ChatInput'

export default function ChatRoomPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { profile, messages, conversation, newMessage, setNewMessage, loading, messagesEndRef, sendMessage } = useChatRoom(params.id)

  if (loading) return <div className="min-h-screen bg-[#050814] text-center pt-20 text-white">جاري التحميل...</div>

  return (
    <div dir="rtl" className="min-h-screen bg-[#050814] flex flex-col font-[family-name:var(--font-arabic)] text-white">
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#0A0D1A]/90 backdrop-blur-md border-b border-white/5 px-4 py-3 flex items-center gap-4">
        <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1E2538] hover:bg-[#2A3441] transition-colors"><ChevronRight size={24} /></button>
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-[#1E2538] bg-[#1E2538]"><Image src={conversation?.worker?.avatar_url || "/client_avatar.png"} alt="Worker" fill className="object-cover" /></div>
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#4ADE80] rounded-full border-2 border-[#0A0D1A]" />
          </div>
          <div><h2 className="font-bold text-sm">{conversation?.worker?.full_name || 'حرفي'}</h2><span className="text-[10px] text-[#4ADE80]">متصل الآن</span></div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-24 flex flex-col gap-4">
        {messages.map((msg) => (
          <ChatBubble
            key={msg.id}
            content={msg.content}
            createdAt={msg.created_at}
            isMine={msg.sender_id === profile?.id}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <ChatInput value={newMessage} onChange={setNewMessage} onSubmit={sendMessage} />
    </div>
  )
}
