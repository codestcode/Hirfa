import React, { useState, useEffect, useRef } from 'react'
import { ChevronDown, Check } from 'lucide-react'

interface ServiceDropdownProps {
  availableServices: any[]
  myServices: any[]
  onAddService: (service: any) => void
}

export function ServiceDropdown({ availableServices, myServices, onAddService }: ServiceDropdownProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (service: any) => {
    onAddService(service)
    setDropdownOpen(false)
  }

  return (
    <div className="relative mb-10" ref={dropdownRef}>
      <label className="text-xs text-[#6B7A99] font-bold px-1 mb-2 block">إضافة تخصص جديد</label>
      <button 
        onClick={() => setDropdownOpen(!dropdownOpen)} 
        className={`w-full bg-[#0A0D1A] border rounded-2xl py-4 px-5 flex items-center justify-between transition-all ${dropdownOpen ? 'border-[#FF8A00] shadow-[0_0_15px_rgba(255,138,0,0.1)]' : 'border-white/5 hover:bg-[#0F1322]'}`}
      >
        <span className={`text-sm font-bold ${dropdownOpen ? 'text-white' : 'text-[#6B7A99]'}`}>
          اختر الخدمة...
        </span>
        <ChevronDown size={18} className={`transition-transform duration-300 ${dropdownOpen ? 'rotate-180 text-[#FF8A00]' : 'text-[#6B7A99]'}`} />
      </button>
      
      {dropdownOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#0A0D1A] border border-white/10 rounded-2xl p-2 z-20 shadow-2xl flex flex-col max-h-[280px] overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="text-[10px] text-[#6B7A99] font-bold px-3 py-2 border-b border-white/5 mb-2">
            الخدمات المتاحة للاختيار
          </div>
          {availableServices.map((s) => {
            const isAdded = myServices.find(my => my.id === s.id)
            return (
              <button 
                key={s.id}
                disabled={!!isAdded}
                onClick={() => handleSelect(s)}
                className={`flex items-center justify-between p-3 rounded-xl transition-all text-right w-full group ${
                  isAdded 
                    ? 'opacity-50 cursor-not-allowed bg-transparent' 
                    : 'hover:bg-[#1E2538] hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${isAdded ? 'bg-[#4ADE80]/10 text-[#4ADE80]' : 'bg-[#1E2538] text-[#FF8A00] group-hover:bg-[#FF8A00] group-hover:text-[#0A0D1A]'}`}>
                    <s.icon size={16} />
                  </div>
                  <div className="flex flex-col">
                    <span className={`font-bold text-sm ${isAdded ? 'text-[#4ADE80]' : 'text-white'}`}>{s.name}</span>
                    <span className="text-[10px] text-[#6B7A99]">{s.category}</span>
                  </div>
                </div>
                {isAdded && <Check size={18} className="text-[#4ADE80]" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
