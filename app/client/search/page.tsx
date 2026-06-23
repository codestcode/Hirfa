'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Search, Star, Clock, X, TrendingUp } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/AuthContext'

interface SearchResult {
  id: string
  full_name: string | null
  avatar_url: string | null
  profession: string | null
  category: string | null
  rating: number | null
  completed_orders: number | null
  governorate: string | null
  area: string | null
}

const suggestions = ['صيانة تكييف', 'تركيب سيراميك', 'سباكة', 'دهانات', 'نجارة', 'عزل أسطح', 'كهرباء', 'تبريد']

export default function SearchPage() {
  const router = useRouter()
  const supabase = createClient()
  const { profile } = useAuth()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [searched, setSearched] = useState(false)
  const [totalServices, setTotalServices] = useState(0)
  const [inProgress, setInProgress] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const stored = localStorage.getItem('hirfa_recent_searches')
    if (stored) setRecentSearches(JSON.parse(stored))
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!profile?.id) return
    const fetchStats = async () => {
      const { count: total } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('client_id', profile.id)
      if (total != null) setTotalServices(total)
      const { count: progress } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('client_id', profile.id)
        .in('status', ['pending', 'confirmed'])
      if (progress != null) setInProgress(progress)
    }
    fetchStats()
  }, [profile?.id, supabase])

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setSearched(false)
      return
    }
    const timer = setTimeout(async () => {
      setLoading(true)
      setSearched(true)
      const q = query.trim()
      const { data } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, profession, category, rating, completed_orders, governorate, area')
        .eq('role', 'worker')
        .eq('verified', true)
        .or(`full_name.ilike.%${q}%,profession.ilike.%${q}%,category.ilike.%${q}%`)
        .order('rating', { ascending: false })
        .limit(20)
      setResults(data as unknown as SearchResult[] || [])
      setLoading(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [query, supabase])

  const handleSearch = (term: string) => {
    setQuery(term)
    const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem('hirfa_recent_searches', JSON.stringify(updated))
  }

  const removeRecent = (term: string) => {
    const updated = recentSearches.filter(s => s !== term)
    setRecentSearches(updated)
    localStorage.setItem('hirfa_recent_searches', JSON.stringify(updated))
  }

  return (
    <div dir="rtl" className="min-h-screen bg-[#050814]">
      <div className="sticky top-0 z-10 bg-[#050814]/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center h-14 max-w-[512px] mx-auto px-4 gap-3">
          <button onClick={() => router.back()}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M12.175 9H0V7H12.175L6.575 1.4L8 0L16 8L8 16L6.575 14.6L12.175 9Z" fill="white"/>
            </svg>
          </button>
          <div className="flex-1 relative">
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <Search size={16} className="text-[#4B5A7A]" />
            </div>
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="ابحث عن خدمة أو حرفي..."
              className="w-full h-11 pr-10 pl-4 rounded-2xl bg-[#0A0D1A] border border-white/10 text-white text-sm text-right outline-none placeholder-[#4B5A7A] focus:border-[#FF8A00]/50 transition-colors"
            />
            {query && (
              <button onClick={() => { setQuery(''); setSearched(false) }} className="absolute left-3 top-1/2 -translate-y-1/2">
                <X size={14} className="text-[#4B5A7A]" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-[512px] mx-auto px-4 pb-32">
        {!searched ? (
          <>
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

            {recentSearches.length > 0 && (
              <div className="mt-6">
                <p className="text-xs text-[#6B7A99] font-bold mb-3">عمليات البحث الأخيرة</p>
                <div className="space-y-1">
                  {recentSearches.map((term, i) => (
                    <div key={i} className="flex items-center justify-between py-2.5 px-1">
                      <button onClick={() => removeRecent(term)} className="p-1">
                        <X size={12} className="text-[#4B5A7A]" />
                      </button>
                      <button onClick={() => handleSearch(term)} className="flex items-center gap-3">
                        <span className="text-sm text-white">{term}</span>
                        <Clock size={14} className="text-[#4B5A7A]" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="h-px bg-gradient-to-r from-transparent via-white/5 to-transparent my-4" />
              </div>
            )}

            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-[#6B7A99] font-bold">اقتراحات شائعة</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSearch(s)}
                    className="px-4 py-2.5 rounded-xl bg-[#0A0D1A] border border-white/5 text-white text-xs hover:border-[#FF8A00]/30 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 p-5 rounded-2xl bg-gradient-to-br from-[#0A0D1A] to-[#0F1322] border border-white/5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-[#FF8A00]/10 flex items-center justify-center">
                  <TrendingUp size={16} className="text-[#FF8A00]" />
                </div>
                <h3 className="text-sm font-bold">أكثر من 5000 حرفي معتمد</h3>
              </div>
              <p className="text-xs text-[#6B7A99] leading-relaxed">
                ابحث عن أفضل الحرفيين في منطقتك، جميعهم موثوقون وتم التحقق منهم
              </p>
            </div>
          </>
        ) : (
          <div className="mt-4">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-[#0A0D1A] rounded-2xl p-4 animate-pulse border border-white/5">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-[#1E2538]" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-28 bg-[#1E2538] rounded" />
                        <div className="h-3 w-36 bg-[#1E2538] rounded" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : results.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-[#1E2538] flex items-center justify-center mb-4">
                  <Search size={24} className="text-[#4B5A7A]" />
                </div>
                <p className="text-sm text-[#6B7A99]">لا توجد نتائج لـ "{query}"</p>
                <p className="text-xs text-[#4B5A7A] mt-1">حاول بكلمات بحث مختلفة</p>
              </div>
            ) : (
              <>
                <p className="text-xs text-[#6B7A99] mb-4">
                  تم العثور على <span className="text-white font-bold">{results.length}</span> نتيجة
                </p>
                <div className="space-y-3">
                  {results.map((worker) => (
                    <Link key={worker.id} href={`/client/craftsman/${worker.id}`}>
                      <div className="bg-[#0A0D1A] rounded-2xl p-4 border border-white/5 hover:border-[#FF8A00]/20 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#1E2538] flex items-center justify-center text-white font-bold text-lg shrink-0">
                            {worker.avatar_url ? (
                              <Image src={worker.avatar_url} alt="" width={56} height={56} className="w-full h-full object-cover" />
                            ) : (
                              worker.full_name?.charAt(0) || '?'
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h3 className="text-sm font-bold truncate">{worker.full_name || 'حرفي'}</h3>
                              {worker.rating && (
                                <div className="flex items-center gap-1">
                                  <span className="text-[#FF8A00] text-xs font-bold">{worker.rating.toFixed(1)}</span>
                                  <Star size={10} className="text-[#FF8A00] fill-[#FF8A00]" />
                                </div>
                              )}
                            </div>
                            <p className="text-xs text-[#6B7A99] mt-0.5">{worker.profession || 'حرفي'}</p>
                            <div className="flex items-center gap-3 mt-2 text-[10px] text-[#4B5A7A]">
                              {worker.governorate && <span>{worker.governorate}</span>}
                              {worker.completed_orders != null && (
                                <span>{worker.completed_orders} مهمة</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
