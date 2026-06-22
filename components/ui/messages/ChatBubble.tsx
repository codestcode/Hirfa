import React from 'react'

interface ChatBubbleProps {
  content: string
  createdAt: string
  isMine: boolean
}

export function ChatBubble({ content, createdAt, isMine }: ChatBubbleProps) {
  return (
    <div className={`flex ${isMine ? 'justify-start' : 'justify-end'}`}>
      <div className={`max-w-[75%] rounded-2xl p-3 text-sm leading-relaxed ${isMine ? 'bg-gradient-to-r from-[#FF8A00] to-[#FFB800] text-white shadow-[0_4px_12px_rgba(255,138,0,0.2)] rounded-tr-none' : 'bg-[#1E2538] text-white rounded-tl-none'}`}>
        {content}
        <div className={`text-[9px] mt-1 text-right ${isMine ? 'text-white/70' : 'text-[#6B7A99]'}`}>
          {new Date(createdAt).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  )
}
