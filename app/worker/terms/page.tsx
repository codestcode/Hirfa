'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ChevronRight, FileText, Shield, Scale, Lock, AlertCircle } from 'lucide-react'

const sections = [
  {
    icon: Scale,
    title: 'الشروط والأحكام',
    content: 'باستخدامك لمنصة حِرفة، فإنك توافق على هذه الشروط والأحكام. يرجى قراءتها بعناية. تحتفظ المنصة بالحق في تحديث هذه الشروط في أي وقت.',
  },
  {
    icon: Shield,
    title: 'التزامات الحرفي',
    content: 'يلتزم الحرفي بتقديم الخدمات المتفق عليها بأعلى جودة وفي الوقت المحدد. يجب على الحرفي الالتزام بمعايير الأمان والجودة المحددة من قبل المنصة.',
  },
  {
    icon: Scale,
    title: 'سياسة العمولات',
    content: 'تتقاضى منصة حِرفة عمولة 15% على كل خدمة مكتملة. يتم خصم العمولة تلقائياً قبل إيداع المستحقات في محفظة الحرفي.',
  },
  {
    icon: Lock,
    title: 'الخصوصية والأمان',
    content: 'نحن نحمي بياناتك الشخصية وفقاً لسياسة الخصوصية. لن يتم مشاركة معلوماتك مع أطراف ثالثة دون موافقتك الصريحة.',
  },
  {
    icon: AlertCircle,
    title: 'سياسة الإلغاء والاسترجاع',
    content: 'يمكن للعميل إلغاء الخدمة قبل 24 ساعة من الموعد المحدد دون أي رسوم. في حالة الإلغاء المتأخر، قد يتم تطبيق رسوم إلغاء.',
  },
]

export default function TermsPage() {
  const router = useRouter()

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
          <span className="text-white text-base font-bold leading-6">شروط الخدمة</span>
          <div className="w-10" />
        </div>
      </motion.div>

      <motion.main
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col w-full max-w-[448px] mx-auto px-4 pt-8 gap-4 pb-24"
      >
        <div className="flex items-center gap-3 p-4 rounded-2xl border border-white/10 bg-white/[0.03]">
          <FileText size={20} className="text-primary shrink-0" />
          <p className="text-sm text-white/60 leading-6">
            آخر تحديث: 15 يونيو 2026
          </p>
        </div>

        {sections.map(({ icon: Icon, title, content }, i) => (
          <div key={i} className="flex items-start gap-3 p-4 rounded-2xl border border-white/10 bg-white/[0.03]">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 shrink-0 mt-0.5">
              <Icon size={18} className="text-primary" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-white">{title}</span>
              <p className="text-sm text-white/60 leading-6">{content}</p>
            </div>
          </div>
        ))}

        <p className="text-xs text-[#52627A] text-center pt-4">
          باستمرارك في استخدام المنصة، فإنك توافق على جميع الشروط والأحكام المذكورة أعلاه
        </p>
      </motion.main>
    </div>
  )
}
