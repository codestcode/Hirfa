'use client'

import React from 'react'
import { BellRing, CheckCheck } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { SubPageLayout } from '@/components/ui/SubPageLayout'
import { useNotifications } from '@/hooks/useNotifications'

export default function NotificationsPage() {
  const { notifications, loading, markAsRead, markAllAsRead, unreadCount } = useNotifications()

  return (
    <SubPageLayout>
      <PageHeader
        title="الإشعارات"
        leftElement={
          unreadCount > 0 ? (
            <button onClick={markAllAsRead} className="text-[10px] text-[#FF8A00] font-bold whitespace-nowrap hover:text-[#FFB800] transition-colors">
              تحديد الكل كمقروء
            </button>
          ) : undefined
        }
      />

      <div className="px-6 pb-32">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#FF8A00] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-[#1E2538] flex items-center justify-center mb-4">
              <BellRing size={28} className="text-[#4B5A7A]" />
            </div>
            <p className="text-sm text-[#6B7A99]">لا توجد إشعارات</p>
            <p className="text-xs text-[#4B5A7A] mt-1">ستظهر هنا الإشعارات الجديدة</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2 mt-4">
            {notifications.map((notif) => {
              const isUnread = !notif.is_read
              return (
                <button
                  key={notif.id}
                  onClick={() => { if (isUnread) markAsRead(notif.id) }}
                  className={`w-full text-right p-4 rounded-2xl border transition-all ${
                    isUnread
                      ? 'bg-[#0F1322] border-[#FF8A00]/20'
                      : 'bg-[#0A0D1A] border-white/5'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-1 ${
                      isUnread ? 'bg-[#FF8A00]/15' : 'bg-[#1E2538]'
                    }`}>
                      {isUnread ? (
                        <BellRing size={16} className="text-[#FF8A00]" />
                      ) : (
                        <CheckCheck size={16} className="text-[#4B5A7A]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${isUnread ? 'font-bold' : 'text-[#6B7A99]'}`}>{notif.title}</p>
                      {notif.body && <p className="text-xs text-[#4B5A7A] mt-1 line-clamp-2">{notif.body}</p>}
                      <p className="text-[10px] text-[#3B4A6A] mt-2">
                        {new Date(notif.created_at).toLocaleDateString('ar-EG', {
                          day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                        })}
                      </p>
                    </div>
                    {isUnread && <div className="w-2 h-2 rounded-full bg-[#FF8A00] shrink-0 mt-2" />}
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </SubPageLayout>
  )
}
