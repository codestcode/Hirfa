'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'

function SuccessPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const role = searchParams.get('role') || 'client'
  const [isLoading, setIsLoading] = useState(false)

  const handleContinue = () => {
    setIsLoading(true)
    router.push(role === 'worker' ? '/profile' : '/client/home')
  }

  const dots = [
    { color: 'var(--blue-500)',   size: 10 },
    { color: 'var(--orange-500)', size: 8  },
    { color: 'var(--blue-300)',   size: 6  },
    { color: 'var(--orange-300)', size: 10 },
    { color: 'var(--blue-700)',   size: 7  },
    { color: 'var(--orange-600)', size: 9  },
    { color: 'var(--green-400)',  size: 8  },
    { color: 'var(--blue-400)',   size: 6  },
  ]

  return (
    <div
      dir="rtl"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'var(--color-bg)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-4)',
        fontFamily: 'var(--font-arabic)',
        overflow: 'hidden',
      }}
    >

      {/* ── Confetti burst ── */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {dots.map((dot, i) => (
          <motion.div
            key={i}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{
              x: Math.cos((i * Math.PI * 2) / dots.length) * 160,
              y: Math.sin((i * Math.PI * 2) / dots.length) * 160,
              opacity: 0,
              scale: 0.3,
            }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: dot.size,
              height: dot.size,
              borderRadius: 'var(--radius-full)',
              backgroundColor: dot.color,
              marginLeft: -dot.size / 2,
              marginTop: -dot.size / 2,
            }}
          />
        ))}
      </div>

      {/* ── Success icon ── */}
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
        style={{ marginBottom: 'var(--space-8)' }}
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
          style={{
            width: 100,
            height: 100,
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--color-success-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CheckCircle
            size={52}
            strokeWidth={1.5}
            color="var(--color-success)"
          />
        </motion.div>
      </motion.div>

      {/* ── Text + CTA ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.5 }}
        style={{ textAlign: 'center', maxWidth: 360, width: '100%' }}
      >
        <h2
          style={{
            fontSize: '2rem',
            fontWeight: 'var(--weight-extrabold)',
            color: 'var(--color-text-primary)',
            marginBottom: 'var(--space-3)',
          }}
        >
          تم بنجاح!
        </h2>

        <p
          style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--color-text-secondary)',
            lineHeight: 'var(--leading-loose)',
            marginBottom: 'var(--space-8)',
          }}
        >
          تم تفعيل حسابك بنجاح. يمكنك الآن البدء في استخدام{' '}
          <span style={{ color: 'var(--color-primary)', fontWeight: 'var(--weight-semibold)' }}>
            حِرفة
          </span>{' '}
          والبحث عن حرفيين موثوقين.
        </p>

        {/* CTA */}
        <button
          onClick={handleContinue}
          disabled={isLoading}
          className="w-full rounded-[12px] text-center text-[16px] font-normal leading-6 text-white px-6 py-4 h-14 bg-[var(--gradient-primary-horizontal)] shadow-[0_10px_15px_-3px_rgba(255,138,0,0.20),0_4px_6px_-4px_rgba(255,138,0,0.20)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer border-none"
        >
          {isLoading ? 'جاري...' : 'ابدأ الاستخدام'}
        </button>

        {/* skip */}
        <button
          onClick={() => router.push(role === 'worker' ? '/worker/home' : '/client/home')}
          style={{
            marginTop: 'var(--space-4)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--color-text-secondary)',
            fontFamily: 'var(--font-arabic)',
            fontSize: 'var(--text-xs)',
          }}
        >
          تخطي الآن
        </button>
      </motion.div>

    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#050814] flex items-center justify-center" />
    }>
      <SuccessPageContent />
    </Suspense>
  )
}