import React from 'react'

interface SaveButtonProps {
  loading: boolean
  onClick?: (e: React.FormEvent) => void
  text?: string
  loadingText?: string
  disabled?: boolean
  type?: 'button' | 'submit'
  className?: string
}

export function SaveButton({ 
  loading, 
  onClick, 
  text = 'حفظ التعديلات', 
  loadingText = 'جاري الحفظ...', 
  disabled = false,
  type = 'button',
  className = ''
}: SaveButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      className={`w-full bg-gradient-to-r from-[#FF8A00] to-[#FFB800] text-[#050814] font-bold rounded-2xl py-4 shadow-[0_4px_20px_rgba(255,138,0,0.3)] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity flex justify-center items-center gap-2 ${className}`}
    >
      {loading ? (
        <>
          <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
          {loadingText}
        </>
      ) : text}
    </button>
  )
}
