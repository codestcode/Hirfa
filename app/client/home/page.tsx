'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { useClientHome } from '@/hooks/useClientHome'
import { Bell, Search, Star } from 'lucide-react'
import ToolSilhouettes from '@/components/shared/ToolSilhouettes'

const FigmaPainting = ({ size }: { size?: number }) => <svg width={size || 20} height={size ? size * 1.2 : 24} viewBox="0 0 20 24" fill="none"><path d="M8.75 23.75C8.0625 23.75 7.47396 23.5052 6.98438 23.0156C6.49479 22.526 6.25 21.9375 6.25 21.25V16.25H2.5C1.8125 16.25 1.22396 16.0052 0.734375 15.5156C0.244792 15.026 0 14.4375 0 13.75V5C0 3.625 0.489583 2.44792 1.46875 1.46875C2.44792 0.489583 3.625 0 5 0H20V13.75C20 14.4375 19.7552 15.026 19.2656 15.5156C18.776 16.0052 18.1875 16.25 17.5 16.25H13.75V21.25C13.75 21.9375 13.5052 22.526 13.0156 23.0156C12.526 23.5052 11.9375 23.75 11.25 23.75H8.75ZM2.5 8.75H17.5V2.5H16.25V7.5H13.75V2.5H12.5V5H10V2.5H5C4.3125 2.5 3.72396 2.74479 3.23438 3.23438C2.74479 3.72396 2.5 4.3125 2.5 5V8.75ZM2.5 13.75H17.5V11.25H2.5V13.75Z" fill="#FFA504"/></svg>

const FigmaCarpentry = ({ size }: { size?: number }) => <svg width={size || 22} height={size ? size * 1.18 : 26} viewBox="0 0 22 26" fill="none"><path d="M15.4688 24.75C15.2396 24.9792 14.974 25.1562 14.6719 25.2812C14.3698 25.4062 14.0521 25.4688 13.7188 25.4688C13.3854 25.4688 13.0625 25.4062 12.75 25.2812C12.4375 25.1562 12.1667 24.9792 11.9375 24.75L10.1875 23C9.95833 22.7708 9.78646 22.5156 9.67188 22.2344C9.55729 21.9531 9.48958 21.6667 9.46875 21.375C9.44792 21.0833 9.48438 20.7917 9.57812 20.5C9.67188 20.2083 9.8125 19.9375 10 19.6875L10.1875 19.4375L0 4.875L4.875 0L20.7812 15.9062C21.0104 16.1354 21.1875 16.401 21.3125 16.7031C21.4375 17.0052 21.5 17.3229 21.5 17.6562C21.5 17.9896 21.4375 18.3125 21.3125 18.625C21.1875 18.9375 21.0104 19.2083 20.7812 19.4375L15.4688 24.75ZM11.9688 17.6562L15.5 14.1562L4.875 3.53125L3.25 5.15625L11.9688 17.6562ZM13.7188 22.9688L19 17.6875L17.25 15.9062L11.9375 21.2188L13.7188 22.9688Z" fill="#FFA504"/></svg>

const FigmaPlumbing = ({ size }: { size?: number }) => <svg width={size || 21} height={size ? size * 1.19 : 25} viewBox="0 0 21 25" fill="none"><path d="M19.2812 8.6875L14.875 4.28125L12.2188 6.90625L9.5625 4.28125L13.0938 0.71875C13.3438 0.46875 13.625 0.286458 13.9375 0.171875C14.25 0.0572917 14.5625 0 14.875 0C15.2083 0 15.526 0.0572917 15.8281 0.171875C16.1302 0.286458 16.3958 0.46875 16.625 0.71875L19.2812 3.375C19.6562 3.72917 19.9323 4.14062 20.1094 4.60938C20.2865 5.07812 20.375 5.55208 20.375 6.03125C20.375 6.51042 20.2865 6.97917 20.1094 7.4375C19.9323 7.89583 19.6562 8.3125 19.2812 8.6875ZM2.0625 14.4375C1.6875 14.0625 1.5 13.6198 1.5 13.1094C1.5 12.599 1.6875 12.1562 2.0625 11.7812L5.125 8.6875L7.78125 11.3438L4.6875 14.4375C4.33333 14.8125 3.90104 15 3.39062 15C2.88021 15 2.4375 14.8125 2.0625 14.4375ZM0.71875 23.7188C0.489583 23.4688 0.3125 23.1927 0.1875 22.8906C0.0625 22.5885 0 22.2708 0 21.9375C0 21.6042 0.0572917 21.2865 0.171875 20.9844C0.286458 20.6823 0.46875 20.4062 0.71875 20.1562L9.5625 11.3438L5.59375 7.34375C5.21875 6.98958 5.03125 6.55729 5.03125 6.04688C5.03125 5.53646 5.21875 5.09375 5.59375 4.71875C5.94792 4.34375 6.38542 4.15625 6.90625 4.15625C7.42708 4.15625 7.875 4.34375 8.25 4.71875L12.2188 8.6875L14 6.90625L17.5 10.4688C17.75 10.7188 17.875 11.0104 17.875 11.3438C17.875 11.6771 17.75 11.9688 17.5 12.2188C17.25 12.4688 16.9583 12.5938 16.625 12.5938C16.2917 12.5938 16 12.4688 15.75 12.2188L4.25 23.7188C4 23.9688 3.72396 24.151 3.42188 24.2656C3.11979 24.3802 2.8125 24.4375 2.5 24.4375C2.1875 24.4375 1.875 24.375 1.5625 24.25C1.25 24.125 0.96875 23.9479 0.71875 23.7188Z" fill="#FFA504"/></svg>

const FigmaElectricity = ({ size }: { size?: number }) => <svg width={size || 20} height={size ? size * 1.25 : 25} viewBox="0 0 20 25" fill="none"><path d="M8.1875 20.25L14.6562 12.5H9.65625L10.5625 5.40625L4.78125 13.75H9.125L8.1875 20.25ZM5 25L6.25 16.25H0L11.25 0H13.75L12.5 10H20L7.5 25H5Z" fill="#FFA504"/></svg>

const iconMap: Record<string, React.ComponentType<any>> = {
  painting: FigmaPainting, carpentry: FigmaCarpentry, plumbing: FigmaPlumbing, electricity: FigmaElectricity
}

const HARDCODED_CATEGORIES = [
  { id: 'painting', label_ar: 'دهان', icon: 'painting' },
  { id: 'carpentry', label_ar: 'نجارة', icon: 'carpentry' },
  { id: 'plumbing', label_ar: 'سباكة', icon: 'plumbing' },
  { id: 'electricity', label_ar: 'كهرباء', icon: 'electricity' },
]

export default function ClientHomePage() {
  const router = useRouter()
  const supabase = createClient()
  const { profile } = useAuth()
  const { categories: dbCategories, workers, loading } = useClientHome()
  const [unreadCount, setUnreadCount] = useState(0)
  const [totalServices, setTotalServices] = useState(0)
  const [inProgress, setInProgress] = useState(0)
  const categories = dbCategories.length > 0 ? dbCategories : HARDCODED_CATEGORIES

  useEffect(() => {
    if (!profile?.id) return
    const fetchUnread = async () => {
      const { count } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', profile.id)
        .eq('is_read', false)
      if (count != null) setUnreadCount(count)
    }
    const fetchStats = async () => {
      const { count: total } = await supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('client_id', profile.id)
      if (total != null) setTotalServices(total)
      const { count: progress } = await supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('client_id', profile.id).in('status', ['pending', 'confirmed'])
      if (progress != null) setInProgress(progress)
    }
    fetchUnread()
    fetchStats()
    const channel = supabase.channel('notif-count').on('postgres_changes', {
      event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${profile.id}`
    }, () => fetchUnread()).subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [profile, supabase])

  const displayName = profile?.full_name || 'مستخدم'

  return (
    <div dir="rtl" className="min-h-screen bg-[#020617] relative overflow-hidden">
      <ToolSilhouettes />
      <div className="sticky top-0 z-10 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center justify-between px-4 h-20 max-w-[512px] mx-auto">
          <Link href="/client/notifications" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center relative">
            <Bell size={16} className="text-white" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full bg-[#FF8A00] text-[10px] font-bold text-white flex items-center justify-center px-1 shadow-lg">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Link>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm text-[#94A3B8] font-medium">مرحباً،</p>
              <p className="text-lg font-bold text-white">{displayName} 👋</p>
            </div>
            <div className="relative">
              <div className="w-11 h-11 rounded-full p-0.5 bg-gradient-to-br from-[#FF8A00] to-[#FFB800]">
                <div className="w-full h-full rounded-full overflow-hidden border-2 border-[#020617] bg-[#0F172A] flex items-center justify-center text-white font-bold text-sm">
                  {displayName.charAt(0)}
                </div>
              </div>
              <div className="absolute -bottom-0.5 left-0 w-3.5 h-3.5 rounded-full border-2 border-[#020617] bg-green-500" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[512px] mx-auto px-4 pb-32">
        <button onClick={() => router.push('/client/search')} className="relative mt-4 w-full">
          <div className="w-full h-14 pr-12 pl-4 rounded-xl bg-[#0F172A]/60 text-white placeholder-[#C7C5CF]/50 text-base text-right flex items-center cursor-text">
            <span className="text-[#C7C5CF]/50 text-sm">ابحث عن كهربائي، سباك...</span>
          </div>
          <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#C7C5CF]" />
        </button>

        <Link href={`/client/services/${categories[0]?.id || 'all'}`}>
          <div className="mt-4 rounded-xl bg-[#FFA504] p-6 relative overflow-hidden">
            <div className="absolute -left-6 -bottom-6 opacity-20">
              <svg width="120" height="124" viewBox="0 0 120 124" fill="none"><path d="M104.214 105.806C103.562 105.945 102.929 105.973 102.315 105.89C101.701 105.808 101.097 105.574 100.504 105.189L70.2598 85.5476C69.6668 85.1625 69.2077 84.7063 68.8827 84.179C68.5576 83.6518 68.3258 83.0621 68.1872 82.41C68.0486 81.7579 68.0205 81.1249 68.103 80.511C68.1855 79.8971 68.4193 79.2936 68.8044 78.7006L76.9882 66.0987C77.3733 65.5057 77.8295 65.0466 78.3568 64.7216C78.884 64.3965 79.4737 64.1647 80.1258 64.0261C80.7779 63.8875 81.4109 63.8594 82.0248 63.9419C82.6387 64.0244 83.2422 64.2582 83.8352 64.6433L114.08 84.2843C114.673 84.6695 115.132 85.1256 115.457 85.6529C115.782 86.1802 116.014 86.7699 116.152 87.422C116.291 88.0741 116.319 88.7071 116.237 89.321C116.154 89.9349 115.92 90.5383 115.535 91.1314L107.351 103.733C106.966 104.326 106.51 104.785 105.983 105.11C105.456 105.435 104.866 105.667 104.214 105.806Z" fill="white"/></svg>
            </div>
            <div className="relative z-10">
              <h2 className="text-white text-xl font-bold">احجز حرفي موثوق خلال دقائق</h2>
              <div className="mt-3 inline-block bg-white rounded-lg px-4 py-2">
                <span className="text-[#050B2C] text-xs font-bold">احجز الآن</span>
              </div>
            </div>
          </div>
        </Link>

        <div className="mt-8 p-4 rounded-2xl bg-[#0A0D1A]/60 backdrop-blur-xl border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white text-xl font-bold">الخدمات الرئيسية</h3>
            <Link href="/client/services/all" className="text-[#FFA504] text-xs font-medium">عرض الكل</Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-4 gap-4">
              {[1,2,3,4].map(i => <div key={i} className="flex flex-col items-center gap-2"><div className="w-16 h-16 rounded-2xl bg-white/5 animate-pulse" /><div className="w-12 h-3 rounded bg-white/5 animate-pulse" /></div>)}
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-4">
              {categories.map(cat => {
                const Icon = iconMap[cat.icon || ''] || FigmaPainting
                return (
                  <Link key={cat.id} href={`/client/services/${cat.id}`} className="flex flex-col items-center gap-2">
                    <div className="w-16 h-16 rounded-2xl bg-[#0F172A]/60 flex items-center justify-center">
                      <Icon size={22} />
                    </div>
                    <span className="text-[#E4E1E5] text-xs">{cat.label_ar}</span>
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* Client Stats Cards */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#0A0D1A] to-[#0F1322] border border-white/5">
            <div className="w-9 h-9 rounded-xl bg-[#FFA504]/10 flex items-center justify-center mb-3">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 18C2.45 18 1.97917 17.8042 1.5875 17.4125C1.19583 17.0208 1 16.55 1 16V2C1 1.45 1.19583 0.979167 1.5875 0.5875C1.97917 0.195833 2.45 0 3 0H15C15.55 0 16.0208 0.195833 16.4125 0.5875C16.8042 0.979167 17 1.45 17 2V16C17 16.55 16.8042 17.0208 16.4125 17.4125C16.0208 17.8042 15.55 18 15 18H3ZM3 16H15V2H3V16ZM5 12H13V14H5V12ZM5 4H13V6H5V4ZM5 8H13V10H5V8Z" fill="#FFA504"/></svg>
            </div>
            <p className="text-2xl font-bold text-white">{totalServices}</p>
            <p className="text-xs text-[#6B7A99] mt-1">إجمالي الخدمات</p>
          </div>
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#0A0D1A] to-[#0F1322] border border-white/5">
            <div className="w-9 h-9 rounded-xl bg-[#22C55E]/10 flex items-center justify-center mb-3">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 18C7.9 18 6.875 17.8325 5.925 17.4975C4.975 17.1625 4.12917 16.7042 3.3875 16.1225C2.64583 15.5408 2.025 14.8708 1.525 14.1125C1.025 13.3542 0.666667 12.5333 0.45 11.65C0.233333 10.7667 0.125 9.88333 0.125 9C0.125 8.1 0.233333 7.2125 0.45 6.3375C0.666667 5.4625 1.025 4.64167 1.525 3.875C2.025 3.10833 2.64583 2.43333 3.3875 1.85C4.12917 1.26667 4.975 0.804167 5.925 0.4625C6.875 0.120833 7.9 0 9 0C10.1167 0 11.15 0.145833 12.1 0.4375C13.05 0.729167 13.8958 1.15833 14.6375 1.725C15.3792 2.29167 16 2.96667 16.5 3.75C17 4.53333 17.3583 5.36667 17.575 6.25C17.7917 7.13333 17.9 8.01667 17.9 8.9C17.9 9.8 17.7917 10.6875 17.575 11.5625C17.3583 12.4375 17 13.2625 16.5 14.0375C16 14.8125 15.3792 15.4917 14.6375 16.075C13.8958 16.6583 13.05 17.1208 12.1 17.4625C11.15 17.8042 10.1167 17.875 9 18ZM9 16.125C10.5 16.125 11.8125 15.675 12.9375 14.775C14.0625 13.875 14.9 12.7333 15.45 11.35C14.0333 12.0833 12.55 12.45 11 12.45C9.5 12.45 7.95 12.0917 6.35 11.375C7.21667 12.2417 8.06667 12.675 8.9 12.675C9.5 12.675 10.0583 12.4458 10.575 11.9875C11.0917 11.5292 11.5167 10.9167 11.85 10.15C12.1833 9.38333 12.35 8.53333 12.35 7.6C12.35 6.71667 12.1625 5.86667 11.7875 5.05C11.4125 4.23333 10.8833 3.58333 10.2 3.1C9.51667 2.61667 8.71667 2.375 7.8 2.375C6.13333 2.375 4.75 3.025 3.65 4.325C2.55 5.625 2 7.35 2 9.5C2 10.45 2.15833 11.35 2.475 12.2C2.79167 13.05 3.24167 13.8125 3.825 14.4875C4.44167 15.1792 5.19167 15.7083 6.075 16.075C6.95833 16.4417 7.93333 16.625 9 16.625V16.125ZM7.8 4.15C8.63333 4.15 9.33333 4.43333 9.9 5C10.4667 5.56667 10.75 6.26667 10.75 7.1C10.75 7.93333 10.4667 8.63333 9.9 9.2C9.33333 9.76667 8.63333 10.05 7.8 10.05C6.96667 10.05 6.26667 9.76667 5.7 9.2C5.13333 8.63333 4.85 7.93333 4.85 7.1C4.85 6.26667 5.13333 5.56667 5.7 5C6.26667 4.43333 6.96667 4.15 7.8 4.15Z" fill="#22C55E"/></svg>
            </div>
            <p className="text-2xl font-bold text-white">{inProgress}</p>
            <p className="text-xs text-[#6B7A99] mt-1">قيد التنفيذ</p>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-white text-xl font-bold mb-4">حرفيين متميزين</h3>
          {loading ? (
            <div className="space-y-4">{[1,2].map(i => <div key={i} className="h-24 rounded-2xl bg-white/5 animate-pulse" />)}</div>
          ) : (
            <div className="space-y-4">
              {workers.map(worker => (
                <Link key={worker.id} href={`/client/craftsman/${worker.id}`}>
                  <div className="flex items-center gap-4 p-4 rounded-2xl border border-white/5 bg-[#0F172A]/60">
                    <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-[#1E2538]">
                      {worker.avatar_url ? (
                        <Image src={worker.avatar_url} alt="" width={64} height={64} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white font-bold text-lg">
                          {worker.full_name?.charAt(0) || '?'}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <span className="text-[#FFA504] text-sm font-bold">{worker.rating || 0}</span>
                          <Star size={12} className="text-[#FFA504] fill-[#FFA504]" />
                        </div>
                        <h4 className="text-white font-semibold">{worker.full_name}</h4>
                      </div>
                      <p className="text-[#C7C5CF] text-xs mt-0.5">{worker.profession || 'حرفي'}</p>
                      <p className="text-[#C7C5CF]/40 text-xs mt-1">تم إنجاز {worker.completed_orders || 0} مهمة</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
