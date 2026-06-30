'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Capacitor } from '@capacitor/core'
import { App as CapacitorApp } from '@capacitor/app'

export function CapacitorListener() {
  const router = useRouter()

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      CapacitorApp.addListener('appUrlOpen', (data) => {
        try {
          const url = new URL(data.url)
          
          if (
            url.protocol === 'hirfa:' || 
            (url.protocol === 'https:' && url.host === 'hirfa-amber.vercel.app' && url.pathname.includes('/auth/callback'))
          ) {
            const localUrl = `/auth/callback${url.search}${url.hash}`
            router.push(localUrl)
          }
        } catch (err) {
          console.error('Failed to parse appUrlOpen URL', err)
        }
      })

      return () => {
        CapacitorApp.removeAllListeners()
      }
    }
  }, [router])

  return null
}
