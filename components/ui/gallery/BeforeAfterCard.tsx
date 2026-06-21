import React, { useState } from 'react'
import { Trash2 } from 'lucide-react'

interface BeforeAfterCardProps {
  id: string
  beforeUrl: string
  afterUrl: string
  title: string
  onDelete: (id: string) => void
}

export function BeforeAfterCard({ id, beforeUrl, afterUrl, title, onDelete }: BeforeAfterCardProps) {
  const [sliderPos, setSliderPos] = useState(50)

  return (
    <div className="relative aspect-square rounded-2xl overflow-hidden border border-white/5 bg-[#0A0D1A] group select-none">
      <img src={beforeUrl} alt={`${title} Before`} className="absolute inset-0 w-full h-full object-cover" />
      
      <img 
        src={afterUrl} 
        alt={`${title} After`} 
        className="absolute inset-0 w-full h-full object-cover"
        style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }} 
      />

      <div className="absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
         <input 
           type="range" 
           min="0" 
           max="100" 
           value={sliderPos}
           onChange={(e) => setSliderPos(Number(e.target.value))}
           className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
           dir="ltr"
         />
         <div 
           className="absolute top-0 bottom-0 w-0.5 bg-white pointer-events-none z-20 flex items-center justify-center shadow-[0_0_10px_rgba(0,0,0,0.5)]"
           style={{ left: `${sliderPos}%` }}
         >
           <div className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border-2 border-[#FF8A00]/50 text-[#FF8A00]">
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
               <polyline points="15 18 9 12 15 6"></polyline>
             </svg>
           </div>
         </div>
      </div>

      <div className="absolute top-3 right-3 z-10 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1 rounded-full border border-white/10 pointer-events-none shadow-sm">
        قبل
      </div>
      <div className="absolute top-3 left-3 z-10 bg-[#4ADE80]/80 backdrop-blur-sm text-[#050814] text-[10px] font-bold px-3 py-1 rounded-full border border-[#4ADE80]/20 pointer-events-none shadow-sm">
        بعد
      </div>

      <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 pointer-events-none z-20">
        <div className="flex justify-between items-end pointer-events-auto">
          <span className="text-sm font-bold text-white drop-shadow-md max-w-[70%] truncate">{title}</span>
          <button 
            onClick={() => onDelete(id)}
            className="w-9 h-9 rounded-full bg-[#EF4444]/90 text-white flex items-center justify-center hover:bg-[#EF4444] transition-colors backdrop-blur-sm shadow-lg"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
