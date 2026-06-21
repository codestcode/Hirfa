'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ChevronRight, ChevronDown, HelpCircle, MessageCircle, Phone, Mail, FileText, Search } from 'lucide-react'

const faqs = [
  { q: 'كيف يمكنني تعديل ملفي الشخصي؟', a: 'يمكنك تعديل ملفك الشخصي من خلال الذهاب إلى الحساب &gt; تعديل الملف الشخصي وتحديث بياناتك.' },
  { q: 'كيف يتم حساب أرباحي؟', a: 'يتم حساب أرباحك بناءً على قيمة الخدمات التي أكملتها بعد خصم عمولة المنصة.' },
  { q: 'كم تستغرق عملية توثيق الحساب؟', a: 'تستغرق عملية التوثيق من 24 إلى 48 ساعة بعد رفع المستندات المطلوبة.' },
  { q: 'كيف يمكنني استلام مستحقاتي؟', a: 'يمكنك استلام مستحقاتك عبر طرق الدفع المتاحة: بطاقة بنكية، فودافون كاش، أو إنستاباي.' },
  { q: 'ماذا أفعل إذا واجهت مشكلة مع عميل؟', a: 'يمكنك التواصل مع فريق الدعم عبر زر "مركز المساعدة" أو الاتصال بخدمة العملاء.' },
]

export default function HelpPage() {
  const router = useRouter()
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggleFaq = (i: number) => {
    setOpenIndex(openIndex === i ? null : i)
  }

  return (
    <div dir="rtl" className="min-h-screen flex flex-col items-center font-arabic bg-[#000419]">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full z-[2] border-b border-white/5 bg-[#000419]/95 backdrop-blur-md"
      >
        <div className="h-16 max-w-[512px] w-full flex items-center justify-between px-4 mx-auto">
          <button onClick={() => router.back()} className="flex items-center justify-center rounded-full p-2">
            <ChevronRight size={20} className="text-white" />
          </button>
          <span className="text-white text-base font-bold leading-6">مركز المساعدة</span>
          <div className="w-10" />
        </div>
      </motion.div>

      <motion.main
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col w-full max-w-[448px] mx-auto px-4 pt-8 gap-6 pb-24"
      >
        <div className="flex items-center gap-3 px-4 h-12 rounded-2xl bg-white/5 border border-white/10">
          <Search size={18} className="text-[#52627A]" />
          <input
            type="text"
            placeholder="ابحث عن إجابة..."
            className="flex-1 bg-transparent border-none outline-none text-white text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: MessageCircle, label: 'دردشة مباشرة', desc: 'تحدث مع فريق الدعم' },
            { icon: Phone, label: 'اتصال', desc: 'دعم هاتفي فوري' },
          ].map(({ icon: Icon, label, desc }) => (
            <button key={label} className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-white/10 bg-white/[0.03] cursor-pointer">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10">
                <Icon size={20} className="text-primary" />
              </div>
              <span className="text-sm font-semibold text-white">{label}</span>
              <span className="text-xs text-[#52627A]">{desc}</span>
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-[#52627A] text-sm font-semibold">الأسئلة الشائعة</span>
          <div className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
            {faqs.map((faq, i) => (
              <div key={i} className={i < faqs.length - 1 ? 'border-b border-white/5' : ''}>
                <button
                  onClick={() => toggleFaq(i)}
                  className="flex items-center justify-between w-full p-4 bg-transparent border-none cursor-pointer"
                >
                  <span className="text-sm text-white text-right">{faq.q}</span>
                  <ChevronDown
                    size={16}
                    className={`text-[#52627A] transition-transform ${openIndex === i ? 'rotate-180' : ''}`}
                  />
                </button>
                {openIndex === i && (
                  <div className="px-4 pb-4">
                    <p className="text-sm text-white/60 leading-6">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-2xl bg-primary/5 border border-primary/20">
          <Mail size={20} className="text-primary shrink-0" />
          <div className="flex flex-col">
            <span className="text-sm text-white">البريد الإلكتروني للدعم</span>
            <span className="text-xs text-white/60">support@hirfa.com</span>
          </div>
        </div>
      </motion.main>
    </div>
  )
}
