import React from 'react'

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  icon?: React.ReactNode
}

export function FormInput({ label, icon, className = '', ...props }: FormInputProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs text-[#6B7A99] font-bold px-1">{label}</label>
      <div className="relative">
        {icon && (
          <div className="absolute top-1/2 -translate-y-1/2 right-4 text-[#6B7A99]">
            {icon}
          </div>
        )}
        <input
          {...props}
          className={`w-full bg-[#0A0D1A] border border-white/5 rounded-2xl py-4 text-sm focus:border-[#FF8A00] outline-none transition-colors ${icon ? 'pr-12 pl-4' : 'px-4'} ${className}`}
        />
      </div>
    </div>
  )
}
