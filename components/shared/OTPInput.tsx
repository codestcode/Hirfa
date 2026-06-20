'use client'

import { useRef, useCallback } from 'react'

interface OTPInputProps {
  value: string
  onChange: (val: string) => void
  onComplete?: (val: string) => void
  length?: number
}

export function OTPInput({ value, onChange, onComplete, length = 6 }: OTPInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const values = Array.from({ length }, (_, i) => value[i] || '')

  const focusAt = (i: number) => {
    inputRefs.current[i]?.focus()
  }

  const handleChange = useCallback((i: number, char: string) => {
    if (!/^\d*$/.test(char)) return
    const next = [...values]
    next[i] = char.slice(-1)
    const joined = next.join('')
    onChange(joined)
    if (char && i < length - 1) focusAt(i + 1)
    if (next.every(v => v !== '')) onComplete?.(joined)
  }, [values, onChange, onComplete, length])

  const handleKeyDown = useCallback((i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace') {
      if (!values[i] && i > 0) {
        const next = [...values]
        next[i - 1] = ''
        onChange(next.join(''))
        focusAt(i - 1)
      } else {
        const next = [...values]
        next[i] = ''
        onChange(next.join(''))
      }
    }
    if (e.key === 'ArrowLeft') focusAt(i - 1)
    if (e.key === 'ArrowRight') focusAt(i + 1)
  }, [values, onChange])

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    onChange(pasted)
    focusAt(Math.min(pasted.length, length - 1))
    if (pasted.length === length) onComplete?.(pasted)
  }, [length, onChange, onComplete])

  return (
    <div
      dir="ltr"
      className={`flex ${length > 6 ? 'gap-1.5' : 'gap-3'} justify-center`}
      onPaste={handlePaste}
    >
      {values.map((v, i) => (
        <input
          key={i}
          ref={el => { inputRefs.current[i] = el }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={v}
          onChange={e => handleChange(i, e.target.value)}
          onKeyDown={e => handleKeyDown(i, e)}
          onFocus={e => {
            e.target.select()
          }}
          className={`${length > 6 ? 'w-[36px] h-[50px] text-xl' : 'w-[52px] h-[60px] text-2xl'} text-center font-[var(--weight-bold)] 
                     text-[var(--color-text-primary)] bg-[var(--color-bg-elevated)]
                     border-2 rounded-[var(--radius-md)] outline-none transition-all
                     caret-[var(--color-primary)] font-[var(--font-arabic)]
                     ${v 
                       ? 'border-[var(--color-primary)] shadow-[0_0_0_3px_rgb(56_84_205_/_0.12)]' 
                       : 'border-[var(--color-border)] hover:border-[var(--color-border)]'
                     }`}
          onBlur={e => {
            if (!e.currentTarget.value) {
              // Optional: reset styles on blur if needed
            }
          }}
        />
      ))}
    </div>
  )
}