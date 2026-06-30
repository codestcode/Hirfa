'use client'

import React, { useState } from 'react'
import { MapPin, Loader2 } from 'lucide-react'

interface LocationPickerProps {
  onLocationSelected: (data: { lat: number, lng: number, address: string, governorate: string, area: string }) => void;
  className?: string;
  label?: string;
}

export default function LocationPicker({ onLocationSelected, className = '', label = 'تحديد موقعي الحالي' }: LocationPickerProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError('المتصفح لا يدعم تحديد الموقع')
      return
    }

    setLoading(true)
    setError('')

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=ar`);
          if (!res.ok) throw new Error('فشل في جلب العنوان')
          const data = await res.json();
          
          const address = data.display_name || ''
          const governorate = data.address?.state || data.address?.region || data.address?.city || ''
          const area = data.address?.suburb || data.address?.town || data.address?.village || data.address?.county || ''
          
          onLocationSelected({ lat: latitude, lng: longitude, address, governorate, area })
        } catch (err) {
          console.error(err)
          setError('حدث خطأ أثناء تحديد العنوان')
          onLocationSelected({ lat: latitude, lng: longitude, address: '', governorate: '', area: '' })
        } finally {
          setLoading(false)
        }
      },
      (err) => {
        console.error(err)
        setError('يرجى السماح بصلاحية الموقع')
        setLoading(false)
      },
      { enableHighAccuracy: true }
    )
  }

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <button 
        onClick={handleGetLocation}
        disabled={loading}
        type="button"
        className="w-full flex items-center justify-center gap-2 h-12 bg-white/5 border border-[#FF8A00]/50 rounded-xl text-[#FF8A00] font-semibold text-sm transition-colors hover:bg-[#FF8A00]/10 disabled:opacity-50"
      >
        {loading ? <Loader2 size={18} className="animate-spin" /> : <MapPin size={18} />}
        <span>{loading ? 'جاري تحديد الموقع...' : label}</span>
      </button>
      {error && <span className="text-xs text-red-500 text-right">{error}</span>}
    </div>
  )
}
