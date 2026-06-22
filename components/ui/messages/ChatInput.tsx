import React from 'react'
import { Send } from 'lucide-react'

interface ChatInputProps {
  value: string
  onChange: (val: string) => void
  onSubmit: (e: React.FormEvent) => void
}

export function ChatInput({ value, onChange, onSubmit }: ChatInputProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#0A0D1A] border-t border-white/5 p-4 pb-8">
      <form onSubmit={onSubmit} className="flex gap-2 max-w-[512px] mx-auto w-full">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="اكتب رسالتك هنا..."
          className="flex-1 bg-[#1E2538] text-white text-sm rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-[#FF8A00] transition-shadow placeholder:text-[#6B7A99]"
        />
        <button
          type="submit"
          disabled={!value.trim()}
          className="w-12 h-12 flex items-center justify-center bg-[#FF8A00] text-white rounded-xl shadow-[0_4px_12px_rgba(255,138,0,0.3)] disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
        >
          <Send size={20} className="rotate-180" />
        </button>
      </form>
    </div>
  )
}
