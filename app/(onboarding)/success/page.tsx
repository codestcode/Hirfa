'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'

export default function SuccessPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleContinue = () => {
    setIsLoading(true)
    router.push('/profile')
  }

  // confetti dots — mix of primary & accent colors
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
          className="btn btn-primary"
          style={{
            width: '100%',
            height: 52,
            fontSize: 'var(--text-sm)',
            borderRadius: 'var(--radius-md)',
            opacity: isLoading ? 0.7 : 1,
            cursor: isLoading ? 'not-allowed' : 'pointer',
          }}
        >
          {isLoading ? 'جاري...' : 'ابدأ الاستخدام'}
        </button>

        {/* skip */}
        <button
          onClick={() => router.push('/home')}
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