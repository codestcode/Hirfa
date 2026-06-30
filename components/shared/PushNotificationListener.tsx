'use client'

import { useEffect, useRef } from 'react'
import { Capacitor } from '@capacitor/core'
import { LocalNotifications } from '@capacitor/local-notifications'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/AuthContext'

export function PushNotificationListener() {
  const { profile } = useAuth()
  const supabase = createClient()
  const hasRequestedPermission = useRef(false)

  useEffect(() => {
    // Request permission on mount
    const requestPermission = async () => {
      if (hasRequestedPermission.current) return
      hasRequestedPermission.current = true

      try {
        if (Capacitor.isNativePlatform()) {
          const permStatus = await LocalNotifications.requestPermissions()
          if (permStatus.display !== 'granted') {
            console.log('LocalNotifications permission not granted')
          }
        } else if ('Notification' in window && Notification.permission === 'default') {
          await Notification.requestPermission()
        }
      } catch (err) {
        console.error('Error requesting notification permission:', err)
      }
    }

    requestPermission()
  }, [])

  useEffect(() => {
    if (!profile?.id) return

    const channel = supabase
      .channel('push-notifications')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${profile.id}` },
        async (payload) => {
          const newNotif = payload.new as any

          try {
            if (Capacitor.isNativePlatform()) {
              const perm = await LocalNotifications.checkPermissions()
              if (perm.display === 'granted') {
                await LocalNotifications.schedule({
                  notifications: [
                    {
                      id: Math.floor(Math.random() * 100000),
                      title: newNotif.title || 'إشعار جديد',
                      body: newNotif.body || '',
                      sound: undefined,
                      attachments: undefined,
                      actionTypeId: '',
                      extra: null,
                      smallIcon: 'ic_launcher_round',
                      iconColor: '#FF8A00',
                    },
                  ],
                })
              }
            } else if ('Notification' in window && Notification.permission === 'granted') {
              new Notification(newNotif.title || 'إشعار جديد', {
                body: newNotif.body || '',
                icon: '/hirfa_logo.svg',
              })
            }
          } catch (err) {
            console.error('Failed to show push notification:', err)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [profile?.id, supabase])

  return null
}
