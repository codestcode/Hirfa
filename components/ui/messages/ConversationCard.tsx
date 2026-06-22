import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface ConversationCardProps {
  id: string
  clientId: string
  clientName: string
  clientAvatar?: string
  lastMessage: string
  lastMessageAt: string
}

export function ConversationCard({ id, clientName, clientAvatar, lastMessage, lastMessageAt }: ConversationCardProps) {
  return (
    <Link href={`/messages/${id}`} className="bg-[#0A0D1A] rounded-2xl p-4 border border-white/5 flex items-center gap-4 hover:bg-[#0F1322] transition-colors">
      <div className="relative shrink-0">
        <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#1E2538] bg-[#1E2538]">
          <Image src={clientAvatar || "/client_avatar.png"} alt="Client" fill className="object-cover" />
        </div>
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#4ADE80] rounded-full border-2 border-[#0A0D1A]" />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-bold text-sm truncate">{clientName}</h3>
          <span className="text-[10px] text-[#6B7A99] shrink-0">
            {new Date(lastMessageAt).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <p className="text-xs text-[#94A3B8] truncate">{lastMessage || 'ابدأ المحادثة الآن...'}</p>
      </div>
    </Link>
  )
}
