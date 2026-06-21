import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export const DAYS = [{ id: 'sat', name: 'السبت' }, { id: 'sun', name: 'الأحد' }, { id: 'mon', name: 'الإثنين' }, { id: 'tue', name: 'الثلاثاء' }, { id: 'wed', name: 'الأربعاء' }, { id: 'thu', name: 'الخميس' }, { id: 'fri', name: 'الجمعة' }]

export function useSchedule() {
  const router = useRouter()
  const { user } = useAuth()
  const supabase = createClient()
  
  const [isAvailableNow, setIsAvailableNow] = useState(true)
  const [schedule, setSchedule] = useState<Record<string, any>>({
    sat: { active: true, start: '09:00', end: '17:00' }, sun: { active: true, start: '09:00', end: '17:00' },
    mon: { active: true, start: '09:00', end: '17:00' }, tue: { active: true, start: '09:00', end: '17:00' },
    wed: { active: true, start: '09:00', end: '17:00' }, thu: { active: true, start: '09:00', end: '17:00' },
    fri: { active: false, start: '09:00', end: '17:00' }
  })
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    if (!user) return
    Promise.all([
      supabase.from('profiles').select('is_available').eq('id', user.id).single(),
      supabase.from('worker_schedule').select('*').eq('worker_id', user.id)
    ]).then(([ {data: profile}, {data: schedData} ]) => {
      if (profile) setIsAvailableNow(profile.is_available)
      if (schedData?.length) {
        const newSched = { ...schedule }
        schedData.forEach(s => { if (newSched[s.day_id]) newSched[s.day_id] = { active: s.is_active, start: s.start_time.substring(0, 5), end: s.end_time.substring(0, 5) } })
        setSchedule(newSched)
      }
      setFetching(false)
    })
  }, [user, supabase])

  const toggleDay = (dayId: string) => setSchedule(p => ({ ...p, [dayId]: { ...p[dayId], active: !p[dayId].active } }))
  const handleTimeChange = (dayId: string, field: string, value: string) => setSchedule(p => ({ ...p, [dayId]: { ...p[dayId], [field]: value } }))

  const handleSave = async () => {
    if (!user) return
    setLoading(true)
    await supabase.from('profiles').update({ is_available: isAvailableNow }).eq('id', user.id)
    const upserts = DAYS.map(day => ({ worker_id: user.id, day_id: day.id, is_active: schedule[day.id].active, start_time: schedule[day.id].start + ':00', end_time: schedule[day.id].end + ':00' }))
    await supabase.from('worker_schedule').upsert(upserts, { onConflict: 'worker_id, day_id' })
    router.back()
  }

  return { isAvailableNow, setIsAvailableNow, schedule, toggleDay, handleTimeChange, loading, fetching, handleSave }
}
