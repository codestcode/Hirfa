import React, { useState } from 'react'
import { Smartphone, Landmark } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface AddPaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function AddPaymentModal({ isOpen, onClose, onSuccess }: AddPaymentModalProps) {
  const [step, setStep] = useState<'select' | 'form'>('select')
  const [selectedType, setSelectedType] = useState<'vodafone_cash' | 'bank_account'>('vodafone_cash')
  const [accountNumber, setAccountNumber] = useState('')
  const [holderName, setHolderName] = useState('')
  const [bankName, setBankName] = useState('')
  const [saving, setSaving] = useState(false)

  if (!isOpen) return null

  const handleSelect = (type: 'vodafone_cash' | 'bank_account') => {
    setSelectedType(type)
    setStep('form')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!accountNumber || !holderName) return
    if (selectedType === 'bank_account' && !bankName) return

    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      const { count } = await supabase
        .from('withdrawal_methods')
        .select('*', { count: 'exact', head: true })
        .eq('worker_id', user.id)
      
      const isFirst = count === 0

      const { error } = await supabase
        .from('withdrawal_methods')
        .insert({
          worker_id: user.id,
          type: selectedType,
          account_number: accountNumber,
          bank_name: selectedType === 'bank_account' ? bankName : null,
          holder_name: holderName,
          is_default: isFirst
        })
      
      if (error) {
        alert('فشل حفظ طريقة السحب: ' + error.message)
      } else {
        onSuccess()
        setStep('select')
        setAccountNumber('')
        setHolderName('')
        setBankName('')
      }
    }
    setSaving(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="bg-[#0A0D1A] w-full max-w-[512px] rounded-t-3xl border-t border-white/10 p-6 flex flex-col max-h-[85vh] animate-in slide-in-from-bottom-full duration-300">
        <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-6" />
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-lg font-bold text-white">
            {step === 'select' ? 'طريقة سحب جديدة' : selectedType === 'vodafone_cash' ? 'تفاصيل فودافون كاش' : 'تفاصيل الحساب البنكي'}
          </h3>
          <button 
            onClick={() => {
              if (step === 'form') {
                setStep('select')
              } else {
                onClose()
              }
            }} 
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>
        
        {step === 'select' ? (
          <div className="flex flex-col gap-4">
            <button 
              onClick={() => handleSelect('vodafone_cash')}
              className="flex items-center gap-4 p-4 rounded-2xl border border-white/5 bg-[#1E2538]/30 hover:bg-[#1E2538] transition-colors text-right w-full group"
            >
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-[#4ADE80] group-hover:scale-110 transition-transform">
                <Smartphone size={24} />
              </div>
              <div className="flex flex-col text-right">
                <span className="font-bold text-sm mb-1 text-white">محفظة إلكترونية (فودافون كاش)</span>
                <span className="text-[10px] text-[#6B7A99]">استقبال التحويل على رقم الهاتف الخاص بالمحفظة</span>
              </div>
            </button>

            <button 
              onClick={() => handleSelect('bank_account')}
              className="flex items-center gap-4 p-4 rounded-2xl border border-white/5 bg-[#1E2538]/30 hover:bg-[#1E2538] transition-colors text-right w-full group"
            >
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-[#FFB800] group-hover:scale-110 transition-transform">
                <Landmark size={24} />
              </div>
              <div className="flex flex-col text-right">
                <span className="font-bold text-sm mb-1 text-white">حساب بنكي</span>
                <span className="text-[10px] text-[#6B7A99]">استقبال التحويل مباشرة إلى حسابك البنكي</span>
              </div>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#94A3B8] font-bold text-right">اسم صاحب الحساب</label>
              <input
                type="text"
                required
                placeholder="الاسم الكامل"
                value={holderName}
                onChange={e => setHolderName(e.target.value)}
                className="w-full h-12 px-4 rounded-xl bg-[#020617] border border-white/10 text-white text-sm outline-none placeholder-[#4B5A7A] focus:border-[#FF8A00]/50 transition-colors text-right"
              />
            </div>

            {selectedType === 'bank_account' && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#94A3B8] font-bold text-right">اسم البنك</label>
                <input
                  type="text"
                  required
                  placeholder="البنك الأهلي، بنك مصر، إلخ."
                  value={bankName}
                  onChange={e => setBankName(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl bg-[#020617] border border-white/10 text-white text-sm outline-none placeholder-[#4B5A7A] focus:border-[#FF8A00]/50 transition-colors text-right"
                />
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#94A3B8] font-bold text-right">
                {selectedType === 'vodafone_cash' ? 'رقم المحفظة (الهاتف)' : 'رقم الحساب أو IBAN'}
              </label>
              <input
                type="text"
                required
                placeholder={selectedType === 'vodafone_cash' ? '01xxxxxxxxx' : 'EGxxxxxxxxxxxxxxxxxxxxxxx'}
                value={accountNumber}
                onChange={e => setAccountNumber(e.target.value)}
                className="w-full h-12 px-4 rounded-xl bg-[#020617] border border-white/10 text-white text-sm outline-none placeholder-[#4B5A7A] focus:border-[#FF8A00]/50 transition-colors text-left"
                dir="ltr"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="mt-4 w-full py-4 rounded-xl bg-gradient-to-l from-[#FF8A00] to-[#FFB800] text-white font-bold text-sm shadow-lg shadow-[#FF8A00]/20 disabled:opacity-50"
            >
              {saving ? 'جاري الحفظ...' : 'حفظ وسجل الطريقة'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
