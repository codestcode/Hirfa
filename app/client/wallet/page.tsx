'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface Transaction {
  id: string
  type: 'deposit' | 'payment' | 'refund'
  amount: number
  description: string | null
  created_at: string
}

interface SavedCard {
  id: string
  last_four: string
  card_holder: string
  brand: string
  expiry_date: string
  is_default: boolean
}

export default function WalletPage() {
  const router = useRouter()
  const [balance, setBalance] = useState(0)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [savedCards, setSavedCards] = useState<SavedCard[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }

      const [profileRes, txRes, cardsRes] = await Promise.all([
        supabase.from('profiles').select('wallet_balance').eq('id', user.id).single(),
        supabase.from('transactions').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('saved_cards').select('*').eq('user_id', user.id).order('is_default', { ascending: false }),
      ])

      if (profileRes.data) setBalance(profileRes.data.wallet_balance || 0)
      if (txRes.data) setTransactions(txRes.data)
      if (cardsRes.data) setSavedCards(cardsRes.data)
      setLoading(false)
    }
    fetchData()
  }, [])

  const formatCurrency = (amount: number) =>
    amount.toLocaleString('ar-EG') + ' ج.م'

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long' })

  return (
    <div dir="rtl" className="min-h-screen bg-[#020617]">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#020617]/80 backdrop-blur-md">
        <div className="flex items-center h-14 max-w-[512px] mx-auto px-4 relative">
          <button onClick={() => router.back()} className="absolute left-4">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.175 9H0V7H12.175L6.575 1.4L8 0L16 8L8 16L6.575 14.6L12.175 9Z" fill="white" />
            </svg>
          </button>
          <h1 className="text-white text-xl w-full text-center">المحفظة</h1>
        </div>
      </div>

      <div className="max-w-[512px] mx-auto px-4 pb-32">
        {/* Balance Card */}
        <div className="mt-4 rounded-xl bg-gradient-to-r from-[#E46405] to-[#FFB800] p-5 shadow-[0_10px_15px_-3px_rgba(255,138,0,0.20)]">
          <div className="flex items-center justify-between">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 8V7.2C18 6.0799 18 5.51984 17.782 5.09202C17.5903 4.71569 17.2843 4.40973 16.908 4.21799C16.4802 4 15.9201 4 14.8 4H6.2C5.07989 4 4.51984 4 4.09202 4.21799C3.71569 4.40973 3.40973 4.71569 3.21799 5.09202C3 5.51984 3 6.0799 3 7.2V8M3 8V16.8C3 17.9201 3 18.4802 3.21799 18.908C3.40973 19.2843 3.71569 19.5903 4.09202 19.782C4.51984 20 5.07989 20 6.2 20H17.8C18.9201 20 19.4802 20 19.908 19.782C20.2843 19.5903 20.5903 19.2843 20.782 18.908C21 18.4802 21 17.9201 21 16.8V11.2C21 10.0799 21 9.51984 20.782 9.09202C20.5903 8.71569 20.2843 8.40973 19.908 8.21799C19.4802 8 18.9201 8 17.8 8H3ZM21 12H19C17.8954 12 17 12.8954 17 14C17 15.1046 17.8954 16 19 16H21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-white text-sm">الرصيد الحالي</span>
          </div>
          <div className="mt-3">
            {loading ? (
              <div className="h-9 w-32 bg-white/20 rounded animate-pulse" />
            ) : (
              <span className="text-white text-3xl font-bold">{formatCurrency(balance)}</span>
            )}
          </div>
          <button onClick={() => router.push('/client/wallet/deposit')} className="mt-4 w-full py-2.5 rounded-lg bg-white/27 text-white text-base flex items-center justify-center gap-2">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.99984 4.16663V15.8333M4.1665 9.99996H15.8332" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            اضافة رصيد
          </button>
        </div>

        {/* Payment Methods */}
        <h2 className="text-white text-xl mt-8 mb-3">طرق الدفع</h2>

        {/* Cash Method */}
        <div className="bg-[#0F172A]/60 rounded-2xl p-4 shadow-[0_4px_12px_rgba(5,11,44,0.08)]">
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 rounded-lg bg-[#22C55E]/48 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="6" width="14" height="9" rx="1.5" stroke="#22C55E" strokeWidth="1.5" />
                <circle cx="10" cy="10.5" r="2.5" stroke="#22C55E" strokeWidth="1.5" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-white text-sm font-bold">نقدا (كاش)</p>
              <p className="text-[#73799F] text-xs font-bold">الدفع عند اتمام الخدمة</p>
            </div>
          </div>
        </div>

        {/* Saved Cards */}
        <h2 className="text-white text-xl mt-8 mb-3">بطاقات الاتمان المحفوظة</h2>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[#0F172A]/60 rounded-2xl p-4 h-[72px] animate-pulse" />
            ))}
          </div>
        ) : savedCards.length === 0 ? (
          <p className="text-[#73799F] text-sm text-center py-4">لا توجد بطاقات محفوظة</p>
        ) : (
          savedCards.map((card) => (
            <button key={card.id} onClick={() => router.push(`/client/wallet/edit-card/${card.id}`)} className="w-full bg-[#0F172A]/60 rounded-2xl p-4 mt-3 shadow-[0_4px_12px_rgba(5,11,44,0.08)] text-right hover:bg-[#0F172A]/80 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-lg bg-[#3854CD]/48 flex items-center justify-center shrink-0">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M3 9H21M6.2 19H17.8C18.9201 19 19.4802 19 19.908 18.782C20.2843 18.5903 20.5903 18.2843 20.782 17.908C21 17.4802 21 16.9201 21 15.8V8.2C21 7.0799 21 6.51984 20.782 6.09202C20.5903 5.71569 20.2843 5.40973 19.908 5.21799C19.4802 5 18.9201 5 17.8 5H6.2C5.0799 5 4.51984 5 4.09202 5.21799C3.71569 5.40973 3.40973 5.71569 3.21799 6.09202C3 6.51984 3 7.07989 3 8.2V15.8C3 16.9201 3 17.4802 3.21799 17.908C3.40973 18.2843 3.71569 18.5903 4.09202 18.782C4.51984 19 5.07989 19 6.2 19Z" stroke="#3854CD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm font-bold">{card.card_holder}</p>
                  <p className="text-[#73799F] text-xs font-bold">{card.brand} **** **** **** {card.last_four}</p>
                </div>
                {card.is_default && (
                  <span className="text-[#22C55E] text-xs font-semibold bg-[#22C55E]/10 px-2 py-1 rounded shrink-0">افتراضي</span>
                )}
              </div>
            </button>
          ))
        )}

        {/* Add Card */}
        <button onClick={() => router.push('/client/wallet/add-card')} className="w-full bg-[#0F172A]/60 rounded-2xl p-4 mt-3 shadow-[0_4px_12px_rgba(5,11,44,0.08)] text-right hover:bg-[#0F172A]/80 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 rounded-lg bg-[#3854CD]/48 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 5V19M5 12H19" stroke="#3854CD" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
            <div>
              <p className="text-white text-sm font-bold">اضافة بطاقة</p>
              <p className="text-[#73799F] text-xs font-bold">**** **** **** ****</p>
            </div>
          </div>
        </button>

        {/* Transaction History */}
        <h2 className="text-white text-xl mt-8 mb-3">المعاملات</h2>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[#0F172A]/60 rounded-2xl p-4 h-[72px] animate-pulse" />
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10">
            <p className="text-[#73799F] text-sm">لا توجد معاملات</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx) => {
              const isExpense = tx.type === 'payment'
              return (
                <div key={tx.id} className="bg-[#0F172A]/60 rounded-2xl p-4 shadow-[0_4px_12px_rgba(5,11,44,0.08)]">
                  <div className="flex items-center gap-4">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isExpense ? 'bg-[#EF4444]/48' : 'bg-[#22C55E]/48'}`}>
                      {isExpense ? (
                        <svg width="20" height="20" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M13.3113 14.7254L13.3113 22.645L11.3137 22.6273V11.3136H22.6274L22.6451 13.3112L14.7255 13.3112L23.3345 21.9202L21.9203 23.3344L13.3113 14.7254Z" fill="#EF4444" />
                        </svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20.6298 19.2157L20.6298 11.2961L22.6274 11.3138V22.6275H11.3137L11.296 20.63L19.2156 20.63L10.6066 12.0209L12.0208 10.6067L20.6298 19.2157Z" fill="#22C55E" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm font-bold">{tx.description || (isExpense ? 'مدفوعات' : 'ايداع')}</p>
                      <p className="text-[#73799F] text-xs font-bold">{formatDate(tx.created_at)}</p>
                    </div>
                    <span className={`text-lg font-bold ${isExpense ? 'text-[#EF4444]' : 'text-[#22C55E]'}`}>
                      {isExpense ? '-' : '+'}{formatCurrency(tx.amount)}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
