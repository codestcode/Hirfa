import React from 'react'
import Link from 'next/link'
import { ChevronLeft, LucideIcon } from 'lucide-react'

export interface MenuLinkProps {
  title: string
  href?: string
  icon: LucideIcon
  color: string
  bg: string
  isLast?: boolean
  onClick?: () => void
  isDestructive?: boolean
}

export function MenuLink({ title, href, icon: Icon, color, bg, isLast, onClick, isDestructive }: MenuLinkProps) {
  const content = (
    <div className={`flex items-center justify-between p-4 transition-colors ${isDestructive ? 'hover:bg-[#1E1212]' : 'hover:bg-[#0F1322]'} ${!isLast ? 'border-b border-white/5' : ''}`}>
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: bg }}>
          <Icon size={20} color={color} strokeWidth={1.5} />
        </div>
        <span className={`text-sm font-bold ${isDestructive ? 'text-[#EF4444]' : 'text-white'}`}>{title}</span>
      </div>
      {!isDestructive && <ChevronLeft size={20} className="text-[#6B7A99]" />}
    </div>
  )

  if (href) {
    return <Link href={href}>{content}</Link>
  }

  return (
    <button onClick={onClick} className="w-full text-right block">
      {content}
    </button>
  )
}
