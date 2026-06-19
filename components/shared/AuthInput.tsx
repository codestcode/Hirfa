'use client'

import { LucideIcon } from 'lucide-react'

interface AuthInputProps {
  type?: string
  placeholder?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  rightIcon?: LucideIcon
  leftIcon?: React.ReactNode
}

export function AuthInput({
  type = 'text',
  placeholder,
  value,
  onChange,
  rightIcon: RightIcon,
  leftIcon,
}: AuthInputProps) {
  return (
    <div className="relative">
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full h-12 px-4 pr-12 bg-[#0B0F19] border border-[#1E2538] rounded-xl text-white placeholder-[#4B5A7A] outline-none focus:border-[#FF8A00] transition-colors"
        style={leftIcon ? { paddingLeft: '48px' } : {}}
      />
      {RightIcon && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4B5A7A]">
          <RightIcon size={18} />
        </div>
      )}
      {leftIcon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          {leftIcon}
        </div>
      )}
    </div>
  )
}
