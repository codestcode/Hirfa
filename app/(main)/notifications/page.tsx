'use client'

import React from 'react'
import { Bell, CheckCheck, Wallet, ClipboardList, Info } from 'lucide-react'
import { SubPageLayout } from '@/components/ui/SubPageLayout'
import { PageLoader } from '@/components/ui/PageLoader'
import { useNotifications } from '@/hooks/useNotifications'

const getIcon = (type: string) => {
  switch (type) {
    case 'order': return <ClipboardList size={20} className="text-[#4ADE80]" />
    case 'wallet': return <Wallet size={20} className="text-[#FFB800]" />
    default: return <Info size={20} className="text-[#FF8A00]" />
  }
}

const getBgColor = (type: string) => {
  switch (type) {
    case 'order': return 'bg-[#4ADE80]/10'
    case 'wallet': return 'bg-[#FFB800]/10'
    default: return 'bg-[#FF8A00]/10'
  }
}

export default function NotificationsPage() {
  const { notifications, loading, markAsRead, markAllAsRead, unreadCount } = useNotifications()

  return (
    <SubPageLayout>
      <div className="px-4 py-6 mb-2">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1E2538] flex items-center justify-center text-white relative">
              <Bell size={20} />
              {unreadCount > 0 && <div className="absolute top-0 right-0 w-3 h-3 bg-[#FF8A00] rounded-full border-2 border-[#050814]" />}
            </div>
            <h1 className="text-xl font-bold">الإشعارات</h1>
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllAsRead} className="text-xs text-[#FF8A00] font-bold flex items-center gap-1 hover:opacity-80">
              <CheckCheck size={14} /> مقروء
            </button>
          )}
        </div>

        <div className="flex flex-col gap-3">
          {loading ? <PageLoader /> : notifications.length ? notifications.map(notif => (
            <div key={notif.id} onClick={() => !notif.is_read && markAsRead(notif.id)} className={`relative overflow-hidden rounded-2xl p-4 border transition-colors cursor-pointer ${notif.is_read ? 'bg-[#0A0D1A] border-white/5 opacity-70' : 'bg-[#1E2538]/50 border-[#FF8A00]/20'}`}>
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${getBgColor(notif.type)}`}>
                  {getIcon(notif.type)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-sm font-bold text-white">{notif.title}</h3>
                    <span className="text-[10px] text-[#6B7A99] whitespace-nowrap mr-2">
                      {new Date(notif.created_at).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">{notif.body}</p>
                </div>
                {!notif.is_read && <div className="w-2 h-2 rounded-full bg-[#FF8A00] mt-2 shrink-0 shadow-[0_0_8px_rgba(255,138,0,0.8)]" />}
              </div>
            </div>
          )) : (
            <div className="bg-[#0A0D1A] rounded-2xl p-10 flex flex-col items-center justify-center border border-white/5 text-[#6B7A99]">
              <Bell size={32} className="mb-3 opacity-50" />
              <span className="text-xs">لا توجد إشعارات حالياً</span>
            </div>
          )}
        </div>
      </div>
    </SubPageLayout>
  )
}
