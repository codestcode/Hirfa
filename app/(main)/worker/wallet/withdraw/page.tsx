'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, CheckCircle2, AlertCircle, Phone, Landmark, User, CreditCard } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { SubPageLayout } from '@/components/ui/SubPageLayout'
import { useWallet } from '@/hooks/useWallet'
import { createClient } from '@/lib/supabase/client'

export default function WithdrawPage() {
  const router = useRouter()
  const supabase = createClient()
  const { profile, availableBalance, refreshProfile } = useWallet()

  const [method, setMethod] = useState<'vodafone' | 'bank'>('vodafone')
  const [amount, setAmount] = useState('')
  
  // Vodafone Cash fields
  const [phone, setPhone] = useState('')

  // Bank Transfer fields
  const [bankName, setBankName] = useState('')
  const [accountHolder, setAccountHolder] = useState('')
  const [accountNumber, setAccountNumber] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!profile) return

    const withdrawAmt = Number(amount)
    if (isNaN(withdrawAmt) || withdrawAmt < 100) {
      setError('الحد الأدنى للسحب هو 100 ج.م')
      return
    }

    if (withdrawAmt > availableBalance) {
      setError('المبلغ المطلوب يتجاوز الرصيد المتاح لديك')
      return
    }

    if (method === 'vodafone') {
      const phoneRegex = /^01[0125][0-9]{8}$/
      if (!phoneRegex.test(phone)) {
        setError('يرجى إدخال رقم فودافون كاش مصري صحيح (11 رقم يبدأ بـ 010، 011، 012 أو 015)')
        return
      }
    } else {
      if (!bankName.trim() || !accountHolder.trim() || !accountNumber.trim()) {
        setError('يرجى ملء جميع الحقول المطلوبة للتحويل البنكي')
        return
      }
    }

    setLoading(true)
    try {
      // Calculate updated earnings/balance
      // availableBalance = total_earnings * 0.9
      // to reduce availableBalance by withdrawAmt, we subtract (withdrawAmt / 0.9) from total_earnings
      const newTotalEarnings = Math.max(0, (profile.total_earnings || 0) - (withdrawAmt / 0.9))
      const newWalletBalance = Math.max(0, (profile.wallet_balance || 0) - withdrawAmt)

      const description = method === 'vodafone'
        ? `سحب رصيد فودافون كاش لرقم ${phone}`
        : `سحب رصيد تحويل بنكي لحساب ${bankName} - ${accountNumber} باسم ${accountHolder}`

      // Update profiles table
      const { error: profileErr } = await supabase
        .from('profiles')
        .update({
          total_earnings: newTotalEarnings,
          wallet_balance: newWalletBalance
        })
        .eq('id', profile.id)

      if (profileErr) throw profileErr

      // Insert transaction record
      const { error: transErr } = await supabase
        .from('transactions')
        .insert({
          user_id: profile.id,
          type: 'withdrawal',
          amount: -withdrawAmt,
          description: description
        })

      if (transErr) throw transErr

      // Refresh cached profile state
      await refreshProfile()

      setSuccess(true)
      setTimeout(() => {
        router.push('/worker/wallet')
      }, 2500)
    } catch (err: any) {
      console.error(err)
      setError('حدث خطأ أثناء معالجة عملية السحب. الرجاء المحاولة لاحقاً.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <SubPageLayout>
      <PageHeader title="سحب الرصيد" isTransparent />
      <div className="px-6 py-4">
        {success ? (
          <div className="flex flex-col items-center justify-center py-16 text-center animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 bg-[#22C55E]/10 rounded-full flex items-center justify-center text-[#22C55E] mb-6 border border-[#22C55E]/20">
              <CheckCircle2 size={44} className="animate-bounce" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">تم تقديم الطلب بنجاح!</h2>
            <p className="text-sm text-[#6B7A99] leading-relaxed max-w-xs mx-auto">
              جاري معالجة عملية السحب وإرسال الأموال في أقرب وقت. سيتم إعادة توجيهك إلى المحفظة الآن...
            </p>
          </div>
        ) : (
          <form onSubmit={handleWithdraw} className="flex flex-col gap-6">
            
            {/* Balance Card */}
            <div className="bg-gradient-to-br from-[#1E2538] to-[#0A0D1A] rounded-2xl p-5 border border-white/5 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs text-[#6B7A99] text-right">الرصيد المتاح للسحب</span>
                <span className="text-2xl font-bold text-white mt-1 text-right">
                  {availableBalance.toLocaleString()} <span className="text-xs font-normal text-[#6B7A99]">ج.م</span>
                </span>
              </div>
              <div className="bg-[#4ADE80]/10 text-[#4ADE80] text-xs px-3 py-1.5 rounded-full font-bold">رصيد كافي</div>
            </div>

            {/* Amount Field */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-[#E4E1E5] text-right">المبلغ المطلوب سحبه</label>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="الحد الأدنى 100"
                  min="100"
                  className="w-full h-13 bg-[#0A0D1A] border border-white/10 rounded-2xl pr-4 pl-12 text-white text-lg font-bold text-right outline-none focus:border-[#FF8A00]/50 transition-colors"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#4B5A7A] font-bold">ج.م</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="flex flex-col gap-3">
              <label className="text-sm font-bold text-[#E4E1E5] text-right">طريقة السحب</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => { setMethod('vodafone'); setError('') }}
                  className={`py-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                    method === 'vodafone'
                      ? 'border-[#FF8A00] bg-[#FF8A00]/5 text-white'
                      : 'border-white/5 bg-[#0A0D1A] text-[#6B7A99] hover:border-white/10'
                  }`}
                >
                  <Phone size={20} className={method === 'vodafone' ? 'text-[#FF8A00]' : ''} />
                  <span className="text-xs font-bold">فودافون كاش</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setMethod('bank'); setError('') }}
                  className={`py-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                    method === 'bank'
                      ? 'border-[#FF8A00] bg-[#FF8A00]/5 text-white'
                      : 'border-white/5 bg-[#0A0D1A] text-[#6B7A99] hover:border-white/10'
                  }`}
                >
                  <Landmark size={20} className={method === 'bank' ? 'text-[#FF8A00]' : ''} />
                  <span className="text-xs font-bold">تحويل بنكي</span>
                </button>
              </div>
            </div>

            {/* Conditional Fields */}
            {method === 'vodafone' ? (
              <div className="flex flex-col gap-4 bg-[#0A0D1A]/50 p-4 rounded-2xl border border-white/5 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-[#94A3B8] text-right">رقم فودافون كاش المحول إليه</label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="01xxxxxxxxx"
                      maxLength={11}
                      className="w-full h-12 bg-[#0A0D1A] border border-white/10 rounded-xl pr-10 pl-4 text-white text-sm text-right outline-none focus:border-[#FF8A00]/50"
                    />
                    <Phone size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#4B5A7A]" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4 bg-[#0A0D1A]/50 p-4 rounded-2xl border border-white/5 animate-in fade-in slide-in-from-top-2 duration-200">
                
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-[#94A3B8] text-right">اسم البنك</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={bankName}
                      onChange={e => setBankName(e.target.value)}
                      placeholder="مثال: البنك الأهلي المصري"
                      className="w-full h-12 bg-[#0A0D1A] border border-white/10 rounded-xl pr-10 pl-4 text-white text-sm text-right outline-none focus:border-[#FF8A00]/50"
                    />
                    <Landmark size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#4B5A7A]" />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-[#94A3B8] text-right">اسم صاحب الحساب بالكامل</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={accountHolder}
                      onChange={e => setAccountHolder(e.target.value)}
                      placeholder="أدخل الاسم رباعي كما هو في البنك"
                      className="w-full h-12 bg-[#0A0D1A] border border-white/10 rounded-xl pr-10 pl-4 text-white text-sm text-right outline-none focus:border-[#FF8A00]/50"
                    />
                    <User size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#4B5A7A]" />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-[#94A3B8] text-right">رقم الحساب أو الـ IBAN</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={accountNumber}
                      onChange={e => setAccountNumber(e.target.value)}
                      placeholder="أدخل رقم الحساب أو الآيبان الدولي"
                      className="w-full h-12 bg-[#0A0D1A] border border-white/10 rounded-xl pr-10 pl-4 text-white text-sm text-right outline-none focus:border-[#FF8A00]/50"
                    />
                    <CreditCard size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#4B5A7A]" />
                  </div>
                </div>

              </div>
            )}

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl flex items-start gap-3 text-xs leading-relaxed text-right animate-in fade-in">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !amount}
              className="w-full py-4 rounded-xl bg-gradient-to-l from-[#FF8A00] to-[#FFB800] text-black text-base font-bold shadow-lg shadow-[#FF8A00]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-4 flex items-center justify-center gap-2"
            >
              {loading ? 'جاري إرسال طلب السحب...' : 'تأكيد السحب وتحويل الرصيد'}
            </button>
          </form>
        )}
      </div>
    </SubPageLayout>
  )
}
