'use client'

import React from 'react'
import { Bell, CheckCheck } from 'lucide-react'
import { SubPageLayout } from '@/components/ui/SubPageLayout'
import { PageLoader } from '@/components/ui/PageLoader'
import { NotificationCard } from '@/components/ui/notifications/NotificationCard'
import { useNotifications } from '@/hooks/useNotifications'

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
            <NotificationCard
              key={notif.id}
              id={notif.id}
              title={notif.title}
              body={notif.body}
              type={notif.type}
              isRead={notif.is_read}
              createdAt={notif.created_at}
              onClick={() => !notif.is_read && markAsRead(notif.id)}
            />
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
