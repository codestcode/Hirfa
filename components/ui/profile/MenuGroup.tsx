import React from 'react'
import { MenuLink, MenuLinkProps } from './MenuLink'

interface MenuGroupProps {
  title: string
  items: Omit<MenuLinkProps, 'isLast'>[]
}

export function MenuGroup({ title, items }: MenuGroupProps) {
  return (
    <div>
      <h3 className="text-xs text-[#6B7A99] font-bold mb-3 pl-2">{title}</h3>
      <div className="flex flex-col bg-[#0A0D1A] rounded-2xl border border-white/5 overflow-hidden">
        {items.map((item, index) => (
          <MenuLink 
            key={index} 
            {...item} 
            isLast={index === items.length - 1} 
          />
        ))}
      </div>
    </div>
  )
}
