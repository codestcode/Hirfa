'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const QUICK_AMOUNTS = [50, 100, 200, 500, 1000]

export default function DepositPage() {
  const router = useRouter()
  const supabase = createClient()
  const [amount, setAmount] = useState('')
  const [saving, setSaving] = useState(false)

  const numericAmount = parseInt(amount) || 0

  const handleDeposit = async () => {
    if (numericAmount < 10) return
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setSaving(false); return }
    const { data: profile } = await supabase.from('profiles').select('wallet_balance').eq('id', user.id).single()
    const currentBalance = profile?.wallet_balance || 0
    const { error: balanceErr } = await supabase.from('profiles').update({ wallet_balance: currentBalance + numericAmount }).eq('id', user.id)
    if (balanceErr) { alert('فشل إضافة الرصيد: ' + balanceErr.message); setSaving(false); return }
    const { error: txErr } = await supabase.from('transactions').insert({
      user_id: user.id,
      type: 'deposit',
      amount: numericAmount,
      description: 'إيداع رصيد',
    })
    setSaving(false)
    if (txErr) { alert('فشل تسجيل المعاملة: ' + txErr.message); return }
    router.back()
  }

  return (
    <div dir="rtl" className="min-h-screen bg-[#020617]">
      <div className="sticky top-0 z-10 bg-[#020617]/80 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center h-14 max-w-[512px] mx-auto px-4 relative">
          <button onClick={() => router.back()} className="absolute left-4">
            <ArrowLeft size={16} className="text-white" />
          </button>
          <h1 className="text-white text-xl font-bold w-full text-center">إضافة رصيد</h1>
        </div>
      </div>

      <div className="max-w-[512px] mx-auto px-4 pb-32">
        <div className="mt-6 p-6 rounded-2xl bg-gradient-to-br from-[#0F172A]/80 to-[#0A0D1A] border border-white/5">
          <p className="text-[#94A3B8] text-sm mb-4">اختر المبلغ أو أدخل مبلغاً مخصصاً</p>

          <div className="grid grid-cols-3 gap-3">
            {QUICK_AMOUNTS.map(q => (
              <button
                key={q}
                onClick={() => setAmount(q.toString())}
                className={`py-4 rounded-xl text-base font-bold transition border ${
                  numericAmount === q ? 'border-[#FF8A00] bg-[#FF8A00]/10 text-[#FF8A00]' : 'border-white/10 bg-[#020617] text-white'
                }`}
              >
                {q} ج.م
              </button>
            ))}
          </div>

          <div className="mt-6">
            <label className="text-[#94A3B8] text-xs font-bold block mb-2">مبلغ مخصص</label>
            <div className="relative">
              <input
                value={amount}
                onChange={e => setAmount(e.target.value.replace(/\D/g, ''))}
                placeholder="0"
                dir="ltr"
                className="w-full h-14 px-4 rounded-xl bg-[#020617] border border-white/10 text-white text-lg font-bold text-left outline-none placeholder-[#4B5A7A] focus:border-[#FF8A00]/50 transition-colors"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8] text-sm">ج.م</span>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 rounded-2xl bg-[#0F172A]/60 border border-white/5">
          <div className="flex items-center justify-between">
            <span className="text-[#94A3B8] text-sm">المبلغ</span>
            <span className="text-white font-bold">{numericAmount.toLocaleString('ar-EG')} ج.م</span>
          </div>
        </div>

        <button
          onClick={handleDeposit}
          disabled={saving || numericAmount < 10}
          className="mt-8 w-full py-4 rounded-xl bg-gradient-to-l from-[#FF8A00] to-[#FFB800] text-white font-bold text-lg shadow-lg shadow-[#FF8A00]/20 disabled:opacity-50"
        >
          {saving ? 'جاري...' : 'تأكيد الإيداع'}
        </button>
      </div>
    </div>
  )
}
