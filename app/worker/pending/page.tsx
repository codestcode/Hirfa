'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { ShieldCheck, LogOut, Clock, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function WorkerPendingPage() {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const handleRefresh = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: profile } = await supabase
      .from('profiles')
      .select('verified')
      .eq('id', user.id)
      .maybeSingle()

    if (profile?.verified) {
      router.push('/worker/home')
    } else {
      alert('حسابك لسه تحت المراجعة، جرب تاني بعد شوية')
    }
  }

  return (
    <div
      dir="rtl"
      style={{
        minHeight: '100vh',
        background: '#050814',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        fontFamily: 'var(--font-cairo, Cairo, sans-serif)',
        color: '#fff',
        textAlign: 'center'
      }}
    >
      <div style={{ maxWidth: 420, width: '100%' }}>

        {/* Icon */}
        <div style={{
          width: 96, height: 96, borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(255,138,0,0.15), rgba(255,184,0,0.05))',
          border: '2px solid rgba(255,138,0,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 32px'
        }}>
          <Clock size={44} style={{ color: '#FF8A00' }} />
        </div>

        {/* Title */}
        <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 12, color: '#fff' }}>
          حسابك تحت المراجعة
        </h1>

        <p style={{ fontSize: 14, color: '#7285bc', lineHeight: 1.8, marginBottom: 40 }}>
          شكراً لتسجيلك كحرفي في حِرفة! 🎉
          <br />
          فريق الإدارة يراجع بياناتك ومستنداتك حالياً.
          <br />
          هيتم تفعيل حسابك في أقرب وقت بعد التحقق.
        </p>

        {/* Steps */}
        <div style={{
          background: '#0A0D1A',
          borderRadius: 20,
          border: '1px solid rgba(255,255,255,0.05)',
          padding: 24,
          marginBottom: 32,
          textAlign: 'right'
        }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 20, color: '#9ca3af' }}>خطوات التفعيل</h3>

          {[
            { label: 'إنشاء الحساب وإدخال البيانات', done: true },
            { label: 'رفع المستندات المطلوبة', done: true },
            { label: 'مراجعة الإدارة والموافقة', done: false, current: true },
            { label: 'بدء استقبال الطلبات', done: false }
          ].map((step, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 0',
              borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.03)' : 'none'
            }}>
              {step.done ? (
                <CheckCircle2 size={20} style={{ color: '#4ade80', flexShrink: 0 }} />
              ) : step.current ? (
                <div style={{
                  width: 20, height: 20, borderRadius: '50%',
                  border: '2px solid #FF8A00',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                  animation: 'pulse-ring 2s ease-in-out infinite'
                }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#FF8A00' }} />
                </div>
              ) : (
                <div style={{
                  width: 20, height: 20, borderRadius: '50%',
                  border: '2px solid rgba(255,255,255,0.1)',
                  flexShrink: 0
                }} />
              )}
              <span style={{
                fontSize: 13, fontWeight: step.current ? 700 : 500,
                color: step.done ? '#4ade80' : step.current ? '#FF8A00' : '#6b7280'
              }}>
                {step.label}
              </span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button
            onClick={handleRefresh}
            style={{
              width: '100%', height: 48, borderRadius: 14,
              background: 'linear-gradient(90deg, #FF8A00, #FFB800)',
              color: '#000', fontWeight: 900, fontSize: 14,
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              fontFamily: 'inherit'
            }}
          >
            <ShieldCheck size={18} />
            تحقق من حالة التفعيل
          </button>

          <button
            onClick={handleLogout}
            style={{
              width: '100%', height: 44, borderRadius: 14,
              background: 'rgba(127,29,29,0.2)',
              color: '#f87171', fontWeight: 600, fontSize: 13,
              border: '1px solid rgba(239,68,68,0.1)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              fontFamily: 'inherit'
            }}
          >
            <LogOut size={16} />
            تسجيل الخروج
          </button>
        </div>

        <p style={{ fontSize: 11, color: '#4b5563', marginTop: 24 }}>
          لو عندك أي استفسار تواصل معانا على support@hirfa.com
        </p>
      </div>

      <style>{`
        @keyframes pulse-ring {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }
      `}</style>
    </div>
  )
}
