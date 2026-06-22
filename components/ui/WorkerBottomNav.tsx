'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, ClipboardList, MessageSquare, Wallet, UserCircle } from 'lucide-react'

export function WorkerBottomNav() {
  const p = usePathname()
  const tabs = [{ h: '/worker/home', i: Home, l: 'الرئيسية' }, { h: '/worker/orders', i: ClipboardList, l: 'الطلبات' }, { h: '/worker/messages', i: MessageSquare, l: 'الرسائل' }, { h: '/worker/wallet', i: Wallet, l: 'المحفظة' }, { h: '/worker/profile', i: UserCircle, l: 'حسابي' }]

  return (
    <div className="fixed bottom-0 left-0 w-full bg-[#0A0D1A] border-t border-white/10 z-50 pb-safe">
      <div className="mx-auto w-full max-w-[480px] flex items-center justify-between px-2 h-16">
        {tabs.map(t => {
          const a = p === t.h || p.startsWith(`${t.h}/`)
          return <Link key={t.h} href={t.h} className="flex-1 flex flex-col items-center justify-center gap-1 relative h-full"><div className={`p-1.5 rounded-xl transition-colors ${a ? 'bg-[#FF8A00]/10 text-[#FF8A00]' : 'text-[#6B7A99] hover:text-white'}`}><t.i size={22} /></div><span className={`text-[10px] font-bold font-cairo transition-colors ${a ? 'text-[#FF8A00]' : 'text-[#6B7A99]'}`}>{t.l}</span></Link>
        })}
      </div>
    </div>
  )
}
