import React, { useState } from 'react'
import Image from 'next/image'
import { ClipboardCheck, Clock, MapPin, Banknote, Navigation, Save } from 'lucide-react'

type TabType = 'pending' | 'confirmed' | 'completed'

interface OrderCardProps {
  order: any
  activeTab: TabType
  onUpdateStatus: (id: string, status: string) => void
  onUpdateTracking?: (
    id: string, 
    tracking_status: string, 
    eta?: string | null, 
    status_notes?: string | null, 
    work_progress?: string | null
  ) => void
}

export function OrderCard({ order, activeTab, onUpdateStatus, onUpdateTracking }: OrderCardProps) {
  const tStatus = order.tracking_status || 'accepted'
  
  let displayAddress = order.address || ''
  let lat: string | null = null
  let lng: string | null = null

  if (displayAddress.includes(' | ')) {
    const parts = displayAddress.split(' | ')
    displayAddress = parts[0]
    const coords = parts[1].split(',')
    if (coords.length === 2) {
      lat = coords[0]
      lng = coords[1]
    }
  }
  
  const [etaInput, setEtaInput] = useState(order.eta || '')
  const [notesInput, setNotesInput] = useState(order.status_notes || '')
  const [updating, setUpdating] = useState(false)

  let parsedNotes = order.notes || ''
  let parsedImages: string[] = []
  try {
    if (order.notes && order.notes.startsWith('{')) {
      const parsed = JSON.parse(order.notes)
      if (parsed.text !== undefined) parsedNotes = parsed.text
      if (parsed.images && Array.isArray(parsed.images)) parsedImages = parsed.images
    }
  } catch (e) {
    // Ignore parse error, it's just a regular string
  }

  const handleUpdateTracking = async (nextStatus: string) => {
    if (!onUpdateTracking) return
    setUpdating(true)
    await onUpdateTracking(order.id, nextStatus, etaInput, notesInput)
    setUpdating(false)
  }

  const handleSaveNotes = async () => {
    if (!onUpdateTracking) return
    setUpdating(true)
    await onUpdateTracking(order.id, tStatus, etaInput, notesInput)
    setUpdating(false)
  }

  return (
    <div className="bg-gradient-to-b from-[#1A1410] to-[#0A0D1A] rounded-2xl p-4 border border-[#FF8A00]/20 shadow-[0_0_20px_rgba(255,138,0,0.05)] text-right">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          {order.is_emergency ? (
            <div className="bg-[#ED4C5C]/15 text-[#ED4C5C] text-[10px] px-2 py-1 rounded-full font-bold">طوارئ</div>
          ) : null}
          <div className={`text-[10px] px-2 py-1 rounded-full ${
            activeTab === 'pending' ? 'bg-[#FF8A00]/10 text-[#FF8A00]' :
            activeTab === 'confirmed' ? 'bg-[#4ADE80]/10 text-[#4ADE80]' :
            'bg-white/10 text-white/60'
          }`}>
            {activeTab === 'pending' ? 'جديد' : activeTab === 'confirmed' ? 'مؤكد' : 'مكتمل'}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-start text-right">
            <span className="text-sm font-bold text-white">{order.client?.full_name || 'عميل'}</span>
            <span className="text-[10px] text-[#6B7A99] flex items-center gap-1">
              {order.service_name} <ClipboardCheck size={10} />
            </span>
          </div>
          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-[#1E2538]">
            <Image src={order.client?.avatar_url || "/client_avatar.png"} alt="Client" fill className="object-cover" />
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between bg-[#050814]/50 rounded-xl p-3 mb-4 text-xs">
        <div className="flex items-center gap-1.5 text-[#FFB800] font-bold">
          <span>{order.price} ج.م</span>
          <Banknote size={14} />
        </div>
        <div className="w-px h-4 bg-white/10" />
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-1.5 text-white">
            <span>{order.appointment_date} - {order.appointment_time?.slice(0,5)}</span>
            <Clock size={12} className="text-[#FF8A00]" />
          </div>
          <div className="flex items-center gap-1.5 text-[#94A3B8] text-[10px]">
            <span>{displayAddress}</span>
            <MapPin size={10} className="text-[#FF8A00]" />
          </div>
        </div>
      </div>

      {(parsedNotes || parsedImages.length > 0) && (
        <div className="bg-[#050814]/40 rounded-xl p-3 mb-4 text-xs">
          {parsedNotes && (
            <div className="mb-2">
              <span className="text-[#FF8A00] font-bold">ملاحظات العميل:</span>
              <p className="text-white mt-1">{parsedNotes}</p>
            </div>
          )}
          {parsedImages.length > 0 && (
            <div>
              <span className="text-[#FF8A00] font-bold">الصور المرفقة:</span>
              <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
                {parsedImages.map((img, idx) => (
                  <a key={idx} href={img} target="_blank" rel="noopener noreferrer" className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-white/10">
                    <Image src={img} alt="مرفق" fill className="object-cover" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'pending' && (
        <div className="grid grid-cols-[1fr_2fr] gap-3">
          <button onClick={() => onUpdateStatus(order.id, 'cancelled')} className="bg-[#1E2538] text-white text-xs font-bold py-3 rounded-xl hover:opacity-90 transition-opacity">
            رفض
          </button>
          <button onClick={() => onUpdateStatus(order.id, 'confirmed')} className="bg-gradient-to-r from-[#FF8A00] to-[#FFB800] text-white text-xs font-bold py-3 rounded-xl shadow-[0_4px_12px_rgba(255,138,0,0.3)] hover:opacity-90 transition-opacity">
            قبول الطلب
          </button>
        </div>
      )}

      {activeTab === 'confirmed' && (
        <div className="flex flex-col gap-4">
          {/* Tracking controls */}
          <div className="bg-[#050814]/40 p-3 rounded-xl border border-white/5 flex flex-col gap-3">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-bold text-[#FF8A00]">
                {tStatus === 'accepted' ? 'مقبول' :
                 tStatus === 'preparing_to_leave' ? 'جاري التحضير' :
                 tStatus === 'on_the_way' ? 'في الطريق' :
                 tStatus === 'arrived' ? 'وصل لموقع العمل' :
                 tStatus === 'work_started' ? 'بدأ العمل' :
                 'مكتمل'}
              </span>
              <span>حالة التتبع الحالية:</span>
            </div>

            {/* Inputs for ETA / Notes */}
            {tStatus === 'on_the_way' && (
              <div className="flex flex-col gap-2">
                <label className="text-[10px] text-slate-400 font-bold block">الوقت المقدر للوصول (مثال: ١٥ دقيقة)</label>
                <input
                  type="text"
                  placeholder="الوقت المقدر للوصول..."
                  value={etaInput}
                  onChange={(e) => setEtaInput(e.target.value)}
                  className="bg-[#050814] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-right text-white outline-none focus:border-[#FF8A00]"
                />
              </div>
            )}

            {tStatus !== 'completed' && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <button
                    onClick={handleSaveNotes}
                    className="text-[10px] text-[#FF8A00] hover:underline flex items-center gap-0.5"
                  >
                    <Save size={10} />
                    <span>حفظ الملاحظة</span>
                  </button>
                  <label className="text-[10px] text-slate-400 font-bold block">ملاحظات التقدم الحالية</label>
                </div>
                <input
                  type="text"
                  placeholder="أدخل ملاحظات (مثال: جاري إحضار القطع...)"
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  className="bg-[#050814] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-right text-white outline-none focus:border-[#FF8A00]"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-[1fr_2fr] gap-3">
            <button 
              onClick={() => {
                if (lat && lng) {
                  window.open(`geo:${lat},${lng}?q=${lat},${lng}`, '_system')
                }
              }}
              disabled={!lat || !lng}
              className={`text-white text-xs font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-opacity ${(!lat || !lng) ? 'bg-[#1E2538]/50 opacity-50 cursor-not-allowed' : 'bg-[#1E2538] hover:opacity-90'}`}
            >
              الخريطة <Navigation size={14} className="rotate-45" />
            </button>

            {tStatus === 'accepted' && (
              <button
                disabled={updating}
                onClick={() => handleUpdateTracking('preparing_to_leave')}
                className="bg-gradient-to-r from-[#FF8A00] to-[#FFB800] text-white text-xs font-bold py-3 rounded-xl shadow-[0_4px_12px_rgba(255,138,0,0.2)] hover:opacity-90 transition-opacity"
              >
                تحديث الحالة: جاري التحضير
              </button>
            )}

            {tStatus === 'preparing_to_leave' && (
              <button
                disabled={updating}
                onClick={() => handleUpdateTracking('on_the_way')}
                className="bg-gradient-to-r from-[#FF8A00] to-[#FFB800] text-white text-xs font-bold py-3 rounded-xl shadow-[0_4px_12px_rgba(255,138,0,0.2)] hover:opacity-90 transition-opacity"
              >
                تحديث الحالة: التحرك الآن
              </button>
            )}

            {tStatus === 'on_the_way' && (
              <button
                disabled={updating}
                onClick={() => handleUpdateTracking('arrived')}
                className="bg-[#22C55E] text-white text-xs font-bold py-3 rounded-xl shadow-[0_4px_12px_rgba(34,197,94,0.2)] hover:opacity-90 transition-opacity"
              >
                تحديث الحالة: وصلت للموقع
              </button>
            )}

            {tStatus === 'arrived' && (
              <button
                disabled={updating}
                onClick={() => handleUpdateTracking('work_started')}
                className="bg-gradient-to-r from-[#FF8A00] to-[#FFB800] text-white text-xs font-bold py-3 rounded-xl shadow-[0_4px_12px_rgba(255,138,0,0.2)] hover:opacity-90 transition-opacity"
              >
                تحديث الحالة: بدء العمل
              </button>
            )}

            {tStatus === 'work_started' && (
              <button
                disabled={updating}
                onClick={() => handleUpdateTracking('completed')}
                className="bg-[#22C55E] text-white text-xs font-bold py-3 rounded-xl shadow-[0_4px_12px_rgba(34,197,94,0.2)] hover:opacity-90 transition-opacity"
              >
                إكمال وإنهاء الطلب
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
