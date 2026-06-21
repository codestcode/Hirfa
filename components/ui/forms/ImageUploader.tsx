import React from 'react'
import { Camera } from 'lucide-react'

interface ImageUploaderProps {
  id: string
  label: string
  subLabel?: string
  image: string | null
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  height?: string
  iconSize?: number
}

export function ImageUploader({ 
  id, label, subLabel, image, onChange, height = 'h-32', iconSize = 24 
}: ImageUploaderProps) {
  return (
    <div className="relative">
      <input 
        type="file" 
        id={id} 
        accept="image/*" 
        className="hidden" 
        onChange={onChange} 
      />
      <label 
        htmlFor={id} 
        className={`flex flex-col items-center justify-center ${height} bg-[#0A0D1A] border-2 border-dashed border-white/10 rounded-2xl cursor-pointer hover:border-[#FF8A00]/50 transition-colors relative overflow-hidden group`}
      >
        {image ? (
          <img src={image} alt={label} className="w-full h-full object-cover" />
        ) : (
          <>
            <Camera size={iconSize} className="text-[#6B7A99] mb-2 group-hover:text-[#FF8A00] transition-colors" />
            <span className={`${iconSize > 24 ? 'text-sm mb-1' : 'text-xs'} font-bold text-[#6B7A99] group-hover:text-white transition-colors`}>{label}</span>
            {subLabel && <span className="text-[10px] text-[#6B7A99]">{subLabel}</span>}
          </>
        )}
      </label>
    </div>
  )
}
