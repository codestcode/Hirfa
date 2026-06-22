import { useState, useEffect, useCallback, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'

export function useChatRoom(conversationId: string) {
  const { profile } = useAuth()
  const supabase = createClient()
  const [messages, setMessages] = useState<any[]>([])
  const [conversation, setConversation] = useState<any>(null)
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const fetchData = useCallback(async () => {
    const { data: conv } = await supabase.from('conversations').select('*, client:client_id(*)').eq('id', conversationId).single()
    if (conv) setConversation(conv)

    const { data: msgs } = await supabase.from('messages').select('*').eq('conversation_id', conversationId).order('created_at', { ascending: true })
    if (msgs) setMessages(msgs)
    
    setLoading(false)
  }, [conversationId, supabase])

  const subscribeToMessages = useCallback(() => {
    supabase.channel('public:messages').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversationId}` }, payload => {
      setMessages(prev => [...prev, payload.new])
    }).subscribe()
  }, [conversationId, supabase])

  useEffect(() => {
    if (profile) {
      fetchData()
      subscribeToMessages()
    }
    return () => { supabase.removeAllChannels() }
  }, [profile, fetchData, subscribeToMessages, supabase])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !profile) return
    const msg = newMessage.trim()
    setNewMessage('')
    await supabase.from('messages').insert({ conversation_id: conversationId, sender_id: profile.id, content: msg })
    await supabase.from('conversations').update({ last_message: msg, last_message_at: new Date().toISOString() }).eq('id', conversationId)
  }

  return { profile, messages, conversation, newMessage, setNewMessage, loading, messagesEndRef, sendMessage }
}
