'use client'

import React, { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronRight, Send } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'

export default function ChatRoomPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { profile } = useAuth()
  const supabase = createClient()
  const [messages, setMessages] = useState<any[]>([])
  const [conversation, setConversation] = useState<any>(null)
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (profile) {
      fetchData()
      subscribeToMessages()
    }
    return () => {
      supabase.removeAllChannels()
    }
  }, [profile, params.id])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const fetchData = async () => {
    const { data: conv } = await supabase
      .from('conversations')
      .select('*, client:client_id(*)')
      .eq('id', params.id)
      .single()
    if (conv) setConversation(conv)

    const { data: msgs } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', params.id)
      .order('created_at', { ascending: true })
    if (msgs) setMessages(msgs)
    
    setLoading(false)
  }

  const subscribeToMessages = () => {
    supabase
      .channel('public:messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${params.id}` }, payload => {
        setMessages(prev => [...prev, payload.new])
      })
      .subscribe()
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !profile) return

    const msg = newMessage.trim()
    setNewMessage('')

    await supabase.from('messages').insert({
      conversation_id: params.id,
      sender_id: profile.id,
      content: msg
    })

    await supabase.from('conversations').update({
      last_message: msg,
      last_message_at: new Date().toISOString()
    }).eq('id', params.id)
  }

  if (loading) return <div className="min-h-screen bg-[#050814] text-center pt-20 text-white">جاري التحميل...</div>

  return (
    <div dir="rtl" className="min-h-screen bg-[#050814] flex flex-col font-[family-name:var(--font-arabic)] text-white">
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#0A0D1A]/90 backdrop-blur-md border-b border-white/5 px-4 py-3 flex items-center gap-4">
        <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1E2538] hover:bg-[#2A3441] transition-colors">
          <ChevronRight size={24} />
        </button>
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-[#1E2538] bg-[#1E2538]">
              <Image src={conversation?.client?.avatar_url || "/client_avatar.png"} alt="Client" fill className="object-cover" />
            </div>
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#4ADE80] rounded-full border-2 border-[#0A0D1A]" />
          </div>
          <div>
            <h2 className="font-bold text-sm">{conversation?.client?.full_name || 'عميل'}</h2>
            <span className="text-[10px] text-[#4ADE80]">متصل الآن</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-24 flex flex-col gap-4">
        {messages.map((msg) => {
          const isMine = msg.sender_id === profile?.id
          return (
            <div key={msg.id} className={`flex ${isMine ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-[75%] rounded-2xl p-3 text-sm leading-relaxed ${isMine ? 'bg-gradient-to-r from-[#FF8A00] to-[#FFB800] text-white shadow-[0_4px_12px_rgba(255,138,0,0.2)] rounded-tr-none' : 'bg-[#1E2538] text-white rounded-tl-none'}`}>
                {msg.content}
                <div className={`text-[9px] mt-1 text-right ${isMine ? 'text-white/70' : 'text-[#6B7A99]'}`}>
                  {new Date(msg.created_at).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-[#0A0D1A] border-t border-white/5 p-4 pb-8">
        <form onSubmit={sendMessage} className="flex gap-2 max-w-[512px] mx-auto w-full">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="اكتب رسالتك هنا..."
            className="flex-1 bg-[#1E2538] text-white text-sm rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-[#FF8A00] transition-shadow placeholder:text-[#6B7A99]"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="w-12 h-12 flex items-center justify-center bg-[#FF8A00] text-white rounded-xl shadow-[0_4px_12px_rgba(255,138,0,0.3)] disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            <Send size={20} className="rotate-180" />
          </button>
        </form>
      </div>
    </div>
  )
}
