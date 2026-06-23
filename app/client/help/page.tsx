'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, ChevronDown, MessageCircle, Phone, Mail, HelpCircle } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { SubPageLayout } from '@/components/ui/SubPageLayout'

const faqs = [
  { q: 'كيف يمكنني حجز خدمة؟', a: 'يمكنك حجز خدمة من خلال تصفح الفئات المتاحة، اختيار الفني المناسب، ثم تحديد الموعد المناسب وتأكيد الحجز.' },
  { q: 'كيف أغير طريقة الدفع؟', a: 'يمكنك تغيير طريقة الدفع من صفحة تأكيد الحجز قبل إتمام العملية، أو من خلال المحفظة في حسابك الشخصي.' },
  { q: 'سياسة إلغاء الطلبات', a: 'يمكنك إلغاء الطلب قبل وصول الفني بدون رسوم. في حالة الإلغاء بعد بدء الخدمة، قد يتم تطبيق رسوم حسب سياسة المنصة.' },
  { q: 'كيفية تقييم الفنيين', a: 'بعد اكتمال الخدمة، ستتمكن من تقييم الفني من خلال صفحة الطلب. تقييمك يساعدنا في تحسين جودة الخدمات.' },
  { q: 'مشاكل تقنية في التطبيق', a: 'في حالة وجود مشكلة تقنية، يرجى التواصل مع فريق الدعم الفني عبر الواتساب أو البريد الإلكتروني.' },
  { q: 'كيف أسترجع رصيد المحفظة؟', a: 'يمكنك استخدام رصيد المحفظة في حجز الخدمات مباشرة. في حالة طلب استرجاع، يرجى التواصل مع الدعم الفني.' },
]

export default function HelpPage() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const filtered = faqs.filter(f => f.q.includes(search) || f.a.includes(search))

  return (
    <SubPageLayout>
      <PageHeader title="مركز المساعدة" />

      <div className="px-6 pb-32">
        <div className="mt-2 relative mb-8">
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <Search size={18} className="text-[#4B5A7A]" />
          </div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث عن المساعدة..."
            className="w-full h-12 pr-12 pl-4 rounded-2xl bg-[#0A0D1A] border border-white/10 text-white text-sm text-right outline-none placeholder-[#4B5A7A] focus:border-[#FF8A00]/50 transition-colors"
          />
        </div>

        <div className="flex flex-col gap-3 mb-8">
          <button className="flex items-center gap-4 p-4 rounded-2xl bg-[#0A0D1A] border border-white/5 hover:bg-[#0F1322] transition-colors text-right">
            <div className="w-10 h-10 rounded-xl bg-[#1E3A2E] flex items-center justify-center shrink-0">
              <Phone size={18} className="text-[#22C55E]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold">تواصل عبر الواتساب</p>
              <p className="text-xs text-[#6B7A99]">رد سريع من فريق الدعم</p>
            </div>
          </button>
          <button className="flex items-center gap-4 p-4 rounded-2xl bg-[#0A0D1A] border border-white/5 hover:bg-[#0F1322] transition-colors text-right">
            <div className="w-10 h-10 rounded-xl bg-[#1E2A3E] flex items-center justify-center shrink-0">
              <Mail size={18} className="text-[#3B82F6]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold">البريد الإلكتروني</p>
              <p className="text-xs text-[#6B7A99]">support@hirfa.com</p>
            </div>
          </button>
        </div>

        <h2 className="text-xs text-[#6B7A99] font-bold mb-4">الأسئلة الشائعة</h2>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-12 text-center">
            <div className="w-12 h-12 rounded-full bg-[#1E2538] flex items-center justify-center mb-3">
              <Search size={20} className="text-[#4B5A7A]" />
            </div>
            <p className="text-sm text-[#6B7A99]">لا توجد نتائج</p>
            <p className="text-xs text-[#4B5A7A] mt-1">حاول بكلمات بحث مختلفة</p>
          </div>
        ) : (
          <div className="flex flex-col bg-[#0A0D1A] rounded-2xl border border-white/5 overflow-hidden">
            {filtered.map((faq, i) => (
              <div key={i} className={`border-b border-white/5 last:border-b-0 ${openIndex === i ? 'bg-[#0F1322]' : ''}`}>
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-right"
                >
                  <span className="text-sm font-bold flex-1 ml-3">{faq.q}</span>
                  <ChevronDown
                    size={16}
                    className={`text-[#4B5A7A] shrink-0 transition-transform ${openIndex === i ? 'rotate-180' : ''}`}
                  />
                </button>
                {openIndex === i && (
                  <div className="px-4 pb-4">
                    <p className="text-sm text-[#6B7A99] leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-[#0A0D1A] to-[#0F1322] border border-white/5 text-center">
          <div className="w-14 h-14 rounded-full bg-[#FF8A00]/10 flex items-center justify-center mx-auto mb-4">
            <MessageCircle size={26} className="text-[#FF8A00]" />
          </div>
          <h3 className="text-sm font-bold">لم تجد إجابة لسؤالك؟</h3>
          <p className="text-xs text-[#6B7A99] mt-1 mb-4">فريق الدعم الفني جاهز لمساعدتك على مدار الساعة</p>
          <button className="px-8 py-3 rounded-2xl bg-gradient-to-l from-[#FF8A00] to-[#FFB800] text-[#050814] font-bold text-sm shadow-lg shadow-[#FF8A00]/20 hover:opacity-90 transition-opacity">
            بدء محادثة فورية
          </button>
        </div>
      </div>
    </SubPageLayout>
  )
}
