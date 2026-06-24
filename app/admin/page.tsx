'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Users, ClipboardList, AlertCircle, LayoutGrid, LogOut, 
  CheckCircle, XCircle, Search, Plus, Trash2, ShieldCheck, 
  MapPin, Phone, Mail, Award, DollarSign, MessageSquare, Send, UserCheck, Edit
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/AuthContext'

type TabType = 'overview' | 'users' | 'activations' | 'bookings' | 'emergencies' | 'categories' | 'rules' | 'messages' | 'services' | 'reviews' | 'transactions' | 'gallery' | 'notifications'

export default function AdminDashboard() {
  const router = useRouter()
  const supabase = createClient()
  const { profile } = useAuth()
  
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [loading, setLoading] = useState(true)
  
  const [stats, setStats] = useState({
    totalClients: 0,
    totalWorkers: 0,
    totalBookings: 0,
    activeEmergencies: 0,
    totalEarnings: 0
  })
  const [profilesList, setProfilesList] = useState<any[]>([])
  const [bookingsList, setBookingsList] = useState<any[]>([])
  const [emergenciesList, setEmergenciesList] = useState<any[]>([])
  const [categoriesList, setCategoriesList] = useState<any[]>([])
  const [rulesList, setRulesList] = useState<any[]>([])
  const [servicesList, setServicesList] = useState<any[]>([])
  const [reviewsList, setReviewsList] = useState<any[]>([])
  const [transactionsList, setTransactionsList] = useState<any[]>([])
  const [galleryList, setGalleryList] = useState<any[]>([])
  const [notificationsList, setNotificationsList] = useState<any[]>([])
  
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<'all' | 'client' | 'worker' | 'admin'>('all')
  
  const [newCatAr, setNewCatAr] = useState('')
  const [newCatEn, setNewCatEn] = useState('')
  const [newCatIcon, setNewCatIcon] = useState('')
  const [newRulePattern, setNewRulePattern] = useState('')
  const [editingSkill, setEditingSkill] = useState<{ id: string; name: string } | null>(null)
  const [newAdminEmail, setNewAdminEmail] = useState('')
  
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [viewUserDetails, setViewUserDetails] = useState<any>(null)
  const [editUserData, setEditUserData] = useState<any>(null)
  const [rejectUser, setRejectUser] = useState<any>(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [isRejecting, setIsRejecting] = useState(false)
  const [isEditingUser, setIsEditingUser] = useState(false)
  const [messageText, setMessageText] = useState('')
  const [sendingMessage, setSendingMessage] = useState(false)
  const [notifTitle, setNotifTitle] = useState('')
  const [notifBody, setNotifBody] = useState('')
  const [sendingNotif, setSendingNotif] = useState(false)
  const [editingService, setEditingService] = useState<any>(null)
  const [savingService, setSavingService] = useState(false)
  
  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const { data: profiles, error: pErr } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
      if (pErr) throw pErr

      const { data: bookings, error: bErr } = await supabase
        .from('bookings')
        .select(`
          *,
          client:client_id(full_name, phone),
          worker:worker_id(full_name, phone)
        `)
        .order('created_at', { ascending: false })
      if (bErr) throw bErr

      const { data: emergencies, error: eErr } = await supabase
        .from('emergencies')
        .select(`
          *,
          client:client_id(full_name, phone),
          worker:assigned_craftsman_id(full_name)
        `)
        .order('created_at', { ascending: false })
      if (eErr) throw eErr

      const { data: categories, error: cErr } = await supabase
        .from('categories')
        .select('*')
        .order('usage_count', { ascending: false })
      if (cErr) throw cErr

      const { data: rules, error: rErr } = await supabase
        .from('admin_rules')
        .select('*')
        .order('created_at', { ascending: false })
      if (rErr) throw rErr

      const { data: services } = await supabase
        .from('services')
        .select('*, worker:craftsman_id(full_name, phone)')
        .order('created_at', { ascending: false })

      const { data: reviews } = await supabase
        .from('reviews')
        .select('*, client:client_id(full_name), worker:craftsman_id(full_name)')
        .order('created_at', { ascending: false })

      const { data: transactions } = await supabase
        .from('transactions')
        .select('*, user:user_id(full_name, email)')
        .order('created_at', { ascending: false })

      const { data: gallery } = await supabase
        .from('worker_gallery')
        .select('*, worker:worker_id(full_name)')
        .order('created_at', { ascending: false })

      const { data: notifications } = await supabase
        .from('notifications')
        .select('*, user:user_id(full_name)')
        .order('created_at', { ascending: false })

      setProfilesList(profiles || [])
      setBookingsList(bookings || [])
      setEmergenciesList(emergencies || [])
      setCategoriesList(categories || [])
      setRulesList(rules || [])
      setServicesList(services || [])
      setReviewsList(reviews || [])
      setTransactionsList(transactions || [])
      setGalleryList(gallery || [])
      setNotificationsList(notifications || [])

      const clients = profiles?.filter(p => p.role === 'client') || []
      const workers = profiles?.filter(p => p.role === 'worker') || []
      const activeE = emergencies?.filter(e => e.status !== 'completed') || []
      const revenue = bookings?.reduce((acc, curr) => acc + Number(curr.total_amount || 0), 0) || 0

      setStats({
        totalClients: clients.length,
        totalWorkers: workers.length,
        totalBookings: bookings?.length || 0,
        activeEmergencies: activeE.length,
        totalEarnings: revenue
      })

    } catch (error) {
      console.error('Error fetching admin data:', error)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const verifyUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ verified: true, verification_status: 'verified', rejection_reason: null })
        .eq('id', userId)
      if (error) throw error
      fetchData()
    } catch (err) {
      alert('فشل توثيق الحساب')
    }
  }

  const submitRejectUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!rejectUser || !rejectionReason.trim()) return
    setIsRejecting(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ verified: false, verification_status: 'rejected', rejection_reason: rejectionReason.trim() })
        .eq('id', rejectUser.id)
      if (error) throw error
      setRejectUser(null)
      setRejectionReason('')
      fetchData()
    } catch (err) {
      alert('فشل رفض التوثيق')
    } finally {
      setIsRejecting(false)
    }
  }

  const saveUserData = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editUserData) return
    setIsEditingUser(true)
    try {
      const { id, created_at, avatar_url, id_front_url, id_back_url, portfolio_urls, ...updates } = editUserData
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', id)
      if (error) throw error
      setEditUserData(null)
      setViewUserDetails(null)
      fetchData()
      alert('تم تحديث البيانات بنجاح')
    } catch (err) {
      alert('فشل تحديث البيانات')
    } finally {
      setIsEditingUser(false)
    }
  }

  const deleteProfile = async (userId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الحساب نهائياً؟')) return
    try {
      const res = await fetch('/api/admin/delete-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error || 'Failed to delete user')
      fetchData()
    } catch (err) {
      alert('فشل حذف الحساب')
    }
  }

  const updateBookingStatus = async (bookingId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', bookingId)
      if (error) throw error
      fetchData()
    } catch (err) {
      alert('فشل تحديث حالة الطلب')
    }
  }

  const addCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCatAr || !newCatEn) return
    try {
      const { error } = await supabase
        .from('categories')
        .insert({
          label_ar: newCatAr,
          label_en: newCatEn,
        })
      if (error) throw error
      setNewCatAr('')
      setNewCatEn('')
      fetchData()
    } catch (err) {
      alert('فشل إضافة القسم الجديد')
    }
  }

  const deleteCategory = async (id: string) => {
    if (!confirm('هل تريد حذف هذا القسم؟')) return
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)
      if (error) throw error
      fetchData()
    } catch (err) {
      alert('فشل حذف القسم')
    }
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUser || !messageText.trim()) return
    setSendingMessage(true)
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: profile?.id,
          receiver_id: selectedUser.id,
          text: messageText.trim(),
          is_read: false
        })
      if (error) throw error
      setMessageText('')
      alert('تم إرسال الرسالة بنجاح')
    } catch (err) {
      alert('فشل إرسال الرسالة')
    } finally {
      setSendingMessage(false)
    }
  }

  const addRule = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newRulePattern.trim()) return
    try {
      const { error } = await supabase
        .from('admin_rules')
        .insert({ pattern: newRulePattern.trim() })
      if (error) throw error
      setNewRulePattern('')
      fetchData()
    } catch (err) {
      alert('فشل إضافة القاعدة')
    }
  }

  const deleteRule = async (id: string) => {
    if (!confirm('هل تريد حذف هذه القاعدة؟')) return
    try {
      const { error } = await supabase
        .from('admin_rules')
        .delete()
        .eq('id', id)
      if (error) throw error
      fetchData()
    } catch (err) {
      alert('فشل حذف القاعدة')
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setRejectionReason('')
    router.push('/login')
  }

  const filteredProfiles = profilesList.filter(p => {
    const matchesSearch = (p.full_name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
                          (p.phone || '').includes(searchQuery) ||
                          (p.email || '').includes(searchQuery)
    const matchesRole = roleFilter === 'all' || p.role === roleFilter
    return matchesSearch && matchesRole
  })

  const tabs = [
    { id: 'overview' as TabType, label: 'الإحصائيات العامة', icon: ClipboardList },
    { id: 'activations' as TabType, label: 'تفعيل الحسابات', icon: UserCheck },
    { id: 'users' as TabType, label: 'إدارة المستخدمين', icon: Users },
    { id: 'bookings' as TabType, label: 'إدارة الحجوزات', icon: DollarSign },
    { id: 'services' as TabType, label: 'الخدمات', icon: Award },
    { id: 'emergencies' as TabType, label: 'بلاغات الطوارئ', icon: AlertCircle },
    { id: 'categories' as TabType, label: 'أقسام المنصة', icon: LayoutGrid },
    { id: 'reviews' as TabType, label: 'التقييمات', icon: Award },
    { id: 'transactions' as TabType, label: 'المعاملات المالية', icon: DollarSign },
    { id: 'gallery' as TabType, label: 'معرض الأعمال', icon: MapPin },
    { id: 'notifications' as TabType, label: 'الإشعارات', icon: Send },
    { id: 'rules' as TabType, label: 'صلاحيات الأدمن', icon: ShieldCheck },
    { id: 'messages' as TabType, label: 'إرسال رسائل', icon: MessageSquare }
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#050814', color: '#fff', fontFamily: 'var(--font-cairo, Cairo, sans-serif)', paddingBottom: 48 }}>
      
      {/* Header */}
      <header style={{ 
        borderBottom: '1px solid rgba(255,255,255,0.05)', 
        background: 'rgba(10,13,26,0.8)', 
        backdropFilter: 'blur(20px)',
        position: 'sticky', top: 0, zIndex: 40, 
        padding: '16px 24px', 
        display: 'flex', alignItems: 'center', justifyContent: 'space-between' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src="/hirfa_logo.svg" alt="Hirfa Logo" style={{ width: 40, height: 40 }} />
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 900, background: 'linear-gradient(90deg, #FF8A00, #FFB800)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>
              لوحة الإدارة - حِرفة
            </h1>
            <span style={{ fontSize: 10, color: '#6b7280' }}>لوحة تحكم النظام الشاملة</span>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 12, background: 'rgba(127,29,29,0.3)', color: '#f87171', border: '1px solid rgba(239,68,68,0.1)', cursor: 'pointer', fontSize: 12 }}
        >
          <LogOut size={14} />
          <span>خروج</span>
        </button>
      </header>

      {/* Main Layout */}
      <div className="flex flex-col md:flex-row w-full max-w-[1280px] mx-auto p-4 md:p-8 gap-4 md:gap-8 overflow-hidden">
        
        {/* Sidebar */}
        <aside className="w-full md:w-[240px] flex-shrink-0 flex flex-row md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          {tabs.map((item) => {
            const Icon = item.icon
            const active = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className="whitespace-nowrap flex-shrink-0"
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 16px',
                  borderRadius: 16,
                  border: active ? '1px solid #FF8A00' : '1px solid rgba(255,255,255,0.05)',
                  background: active ? 'linear-gradient(to left, rgba(255,138,0,0.1), transparent)' : '#0A0D1A',
                  color: active ? '#fff' : '#9ca3af',
                  fontSize: 14, fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: active ? '0 4px 12px rgba(255,138,0,0.05)' : 'none',
                  fontFamily: 'inherit'
                }}
              >
                <Icon size={18} style={{ color: active ? '#FF8A00' : '#6b7280' }} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </aside>

        {/* Content */}
        <main style={{ flex: 1, minWidth: 0, overflowX: 'auto' }}>
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
              <div style={{ width: 32, height: 32, border: '2px solid transparent', borderTopColor: '#FF8A00', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            </div>
          ) : (
            <>
              {/* ===== OVERVIEW TAB ===== */}
              {activeTab === 'overview' && (
                <div className="flex flex-col gap-6">
                  {/* 3 Stat Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
                    {[
                      { label: 'إجمالي العملاء', value: stats.totalClients, gradient: 'linear-gradient(135deg, rgba(37,99,235,0.2), rgba(6,182,212,0.05))', borderColor: 'rgba(59,130,246,0.2)', valueColor: '#fff' },
                      { label: 'إجمالي الحرفيين', value: stats.totalWorkers, gradient: 'linear-gradient(135deg, rgba(255,138,0,0.2), transparent)', borderColor: 'rgba(255,138,0,0.2)', valueColor: '#FF8A00' },
                      { label: 'بلاغات طوارئ نشطة', value: stats.activeEmergencies, gradient: 'linear-gradient(135deg, rgba(220,38,38,0.2), transparent)', borderColor: 'rgba(239,68,68,0.2)', valueColor: '#f87171' }
                    ].map((s, i) => (
                      <div key={i} style={{
                        background: s.gradient,
                        backgroundColor: '#0A0D1A',
                        borderRadius: 24,
                        padding: 24,
                        border: `1px solid ${s.borderColor}`,
                        display: 'flex', flexDirection: 'column', gap: 8
                      }}>
                        <span style={{ fontSize: 12, color: '#9ca3af', fontWeight: 700 }}>{s.label}</span>
                        <span style={{ fontSize: 36, fontWeight: 900, color: s.valueColor }}>{s.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* 2 Bottom Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                    <div style={{ background: '#0A0D1A', borderRadius: 24, padding: 24, border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <span style={{ fontSize: 12, color: '#9ca3af', fontWeight: 700 }}>إجمالي المعاملات وحجم الدفع</span>
                      <span style={{ fontSize: 40, fontWeight: 900, color: '#FF8A00' }}>
                        {stats.totalEarnings} <span style={{ fontSize: 12, fontWeight: 400 }}>ج.م</span>
                      </span>
                    </div>
                    <div style={{ background: '#0A0D1A', borderRadius: 24, padding: 24, border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <span style={{ fontSize: 12, color: '#9ca3af', fontWeight: 700 }}>إجمالي الحجوزات والطلبات</span>
                      <span style={{ fontSize: 40, fontWeight: 900 }}>
                        {stats.totalBookings} <span style={{ fontSize: 12, fontWeight: 400 }}>طلب</span>
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* ===== ACTIVATIONS TAB ===== */}
              {activeTab === 'activations' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <div style={{ background: '#0A0D1A', padding: 24, borderRadius: 24, border: '1px solid rgba(255,255,255,0.05)' }}>
                    <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: '#FF8A00' }}>طلبات انضمام الحرفيين (للمراجعة والتفعيل)</h2>
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', textAlign: 'right', borderCollapse: 'collapse', fontSize: 12 }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: '#0E1224', color: '#9ca3af', fontWeight: 700 }}>
                            <th style={{ padding: 16 }}>الاسم والمستخدم</th>
                            <th style={{ padding: 16 }}>المهنة</th>
                            <th style={{ padding: 16 }}>بيانات الاتصال</th>
                            <th style={{ padding: 16 }}>المنطقة</th>
                            <th style={{ padding: 16 }}>المرفقات</th>
                            <th style={{ padding: 16, textAlign: 'center' }}>القرار</th>
                          </tr>
                        </thead>
                        <tbody>
                          {profilesList.filter(p => p.role === 'worker' && p.verification_status === 'pending').length === 0 ? (
                            <tr>
                              <td colSpan={6} style={{ padding: 32, textAlign: 'center', color: '#6b7280' }}>لا توجد طلبات انضمام معلقة حالياً</td>
                            </tr>
                          ) : (
                            profilesList.filter(p => p.role === 'worker' && p.verification_status === 'pending').map((p) => (
                              <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
                                  <img src={p.avatar_url || '/craftsman_avatar.png'} style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)' }} />
                                  <div>
                                    <div style={{ fontWeight: 700, color: '#fff' }}>{p.full_name || 'بدون اسم'}</div>
                                    <div style={{ fontSize: 10, color: '#6b7280' }}>تاريخ التسجيل: {p.created_at ? new Date(p.created_at).toLocaleDateString('ar-EG') : '-'}</div>
                                  </div>
                                </td>
                                <td style={{ padding: 16, fontWeight: 700, color: '#FF8A00' }}>
                                  {p.profession || '-'}
                                </td>
                                <td style={{ padding: 16 }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Phone size={10} style={{ color: '#6b7280' }} /> {p.phone || '-'}</div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: '#6b7280', marginTop: 2 }}><Mail size={10} /> {p.email || '-'}</div>
                                </td>
                                <td style={{ padding: 16, color: '#d1d5db' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={10} style={{ color: '#6b7280' }} /> {p.governorate || '-'}</div>
                                  <div style={{ fontSize: 10, color: '#6b7280', marginTop: 2 }}>{p.area || '-'}</div>
                                </td>
                                <td style={{ padding: 16 }}>
                                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', maxWidth: 150 }}>
                                    {p.id_front_url && (
                                      <a href={p.id_front_url} target="_blank" rel="noreferrer" title="صورة البطاقة (أمامي)">
                                        <img src={p.id_front_url} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)' }} />
                                      </a>
                                    )}
                                    {p.id_back_url && (
                                      <a href={p.id_back_url} target="_blank" rel="noreferrer" title="صورة البطاقة (خلفي)">
                                        <img src={p.id_back_url} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)' }} />
                                      </a>
                                    )}
                                    {p.portfolio_urls && Array.isArray(p.portfolio_urls) && p.portfolio_urls.map((img: string, idx: number) => (
                                      <a key={idx} href={img} target="_blank" rel="noreferrer" title="معرض الأعمال">
                                        <img src={img} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)' }} />
                                      </a>
                                    ))}
                                    {!p.id_front_url && !p.id_back_url && (!p.portfolio_urls || p.portfolio_urls.length === 0) && (
                                      <span style={{ fontSize: 10, color: '#6b7280' }}>لا يوجد</span>
                                    )}
                                  </div>
                                </td>
                                <td style={{ padding: 16 }}>
                                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                                    <button 
                                      onClick={() => verifyUser(p.id)}
                                      style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid rgba(34,197,94,0.1)', background: 'rgba(20,83,45,0.2)', color: '#22c55e', cursor: 'pointer', display: 'flex', gap: 4, alignItems: 'center' }}
                                    >
                                      <CheckCircle size={14} /> تفعيل
                                    </button>
                                    <button 
                                      onClick={() => deleteProfile(p.id)}
                                      style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid rgba(239,68,68,0.1)', background: 'rgba(127,29,29,0.2)', color: '#ef4444', cursor: 'pointer', display: 'flex', gap: 4, alignItems: 'center' }}
                                    >
                                      <XCircle size={14} /> رفض
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ===== USERS TAB ===== */}
              {activeTab === 'users' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  {/* Search + Filter Bar */}
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center', background: '#0A0D1A', padding: 16, borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ position: 'relative', flex: 1, maxWidth: 300 }}>
                      <Search style={{ position: 'absolute', right: 12, top: 10, color: '#6b7280' }} size={16} />
                      <input 
                        type="text" 
                        placeholder="ابحث بالاسم، الهاتف أو البريد..." 
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        style={{ width: '100%', background: '#050814', fontSize: 12, borderRadius: 12, paddingRight: 40, paddingLeft: 16, paddingTop: 10, paddingBottom: 10, border: '1px solid rgba(255,255,255,0.05)', outline: 'none', color: '#fff', fontFamily: 'inherit' }}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {(['all', 'client', 'worker', 'admin'] as const).map((role) => (
                        <button
                          key={role}
                          onClick={() => setRoleFilter(role as 'all'|'client'|'worker'|'admin')}
                          style={{
                            fontSize: 12, padding: '8px 16px', borderRadius: 12,
                            border: roleFilter === role ? '1px solid #FF8A00' : '1px solid rgba(255,255,255,0.05)',
                            background: roleFilter === role ? '#FF8A00' : '#050814',
                            color: roleFilter === role ? '#fff' : '#9ca3af',
                            fontWeight: roleFilter === role ? 700 : 400,
                            cursor: 'pointer', fontFamily: 'inherit'
                          }}
                        >
                          {role === 'all' ? 'الكل' : role === 'client' ? 'العملاء' : role === 'worker' ? 'الحرفيين' : 'الأدمن'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Users Table */}
                  <div style={{ background: '#0A0D1A', borderRadius: 24, border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', textAlign: 'right', borderCollapse: 'collapse', fontSize: 12 }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: '#0E1224', color: '#9ca3af', fontWeight: 700 }}>
                            <th style={{ padding: 16 }}>الاسم والمستخدم</th>
                            <th style={{ padding: 16 }}>الهاتف والبريد</th>
                            <th style={{ padding: 16 }}>المنطقة</th>
                            <th style={{ padding: 16 }}>الدور والتوثيق</th>
                            <th style={{ padding: 16, textAlign: 'center' }}>العمليات</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredProfiles.map((p) => (
                            <tr 
                              key={p.id} 
                              onClick={() => setViewUserDetails(p)}
                              style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer', transition: 'background 0.2s' }}
                              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                              <td style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
                                <img src={p.avatar_url || '/craftsman_avatar.png'} style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)' }} />
                                <div>
                                  <div style={{ fontWeight: 700, color: '#fff' }}>{p.full_name || 'بدون اسم'}</div>
                                  {p.profession && <div style={{ fontSize: 10, color: '#6b7280' }}>{p.profession}</div>}
                                </div>
                              </td>
                              <td style={{ padding: 16 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Phone size={10} style={{ color: '#6b7280' }} /> {p.phone || '-'}</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: '#6b7280', marginTop: 2 }}><Mail size={10} /> {p.email || '-'}</div>
                              </td>
                              <td style={{ padding: 16, color: '#d1d5db' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={10} style={{ color: '#6b7280' }} /> {p.governorate || '-'}, {p.area || '-'}</div>
                              </td>
                              <td style={{ padding: 16 }}>
                                <span style={{ 
                                  padding: '2px 8px', borderRadius: 9999, fontSize: 9, fontWeight: 700,
                                  background: p.role === 'worker' ? 'rgba(255,138,0,0.1)' : p.role === 'admin' ? 'rgba(168,85,247,0.1)' : 'rgba(59,130,246,0.1)',
                                  color: p.role === 'worker' ? '#FF8A00' : p.role === 'admin' ? '#a855f7' : '#60a5fa'
                                }}>
                                  {p.role === 'worker' ? 'حرفي' : p.role === 'admin' ? 'أدمن' : 'عميل'}
                                </span>
                                {(p.role === 'worker' || p.role === 'admin') && (
                                  <span style={{ 
                                    marginRight: 6, padding: '2px 8px', borderRadius: 9999, fontSize: 9, fontWeight: 700,
                                    background: (p.role === 'admin' || p.verified) ? 'rgba(34,197,94,0.1)' : 'rgba(234,179,8,0.1)',
                                    color: (p.role === 'admin' || p.verified) ? '#4ade80' : '#facc15'
                                  }}>
                                    {(p.role === 'admin' || p.verified) ? 'موثق' : 'غير موثق'}
                                  </span>
                                )}
                              </td>
                              <td style={{ padding: 16 }} onClick={(e) => e.stopPropagation()}>
                                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                                    <button 
                                      onClick={() => { setEditUserData(p); setViewUserDetails(null); }}
                                      style={{ padding: 6, borderRadius: 8, border: '1px solid rgba(59,130,246,0.1)', background: 'rgba(30,58,138,0.2)', color: '#60a5fa', cursor: 'pointer' }}
                                      title="تعديل بيانات الحساب"
                                    >
                                      <Edit size={14} />
                                    </button>
                                    {p.role === 'worker' && (
                                      <>
                                        {!p.verified && (
                                          <button 
                                            onClick={() => verifyUser(p.id)}
                                            style={{ padding: 6, borderRadius: 8, border: '1px solid rgba(34,197,94,0.1)', background: 'rgba(20,83,45,0.2)', color: '#22c55e', cursor: 'pointer' }}
                                            title="توثيق الحساب"
                                          >
                                            <ShieldCheck size={14} />
                                          </button>
                                        )}
                                        {p.verified && (
                                          <button 
                                            onClick={() => setRejectUser(p)}
                                            style={{ padding: 6, borderRadius: 8, border: '1px solid rgba(234,179,8,0.1)', background: 'rgba(113,63,18,0.2)', color: '#eab308', cursor: 'pointer' }}
                                            title="إلغاء التوثيق"
                                          >
                                            <XCircle size={14} />
                                          </button>
                                        )}
                                        {!p.verified && p.verification_status === 'pending' && (
                                          <button 
                                            onClick={() => setRejectUser(p)}
                                            style={{ padding: 6, borderRadius: 8, border: '1px solid rgba(239,68,68,0.1)', background: 'rgba(127,29,29,0.2)', color: '#ef4444', cursor: 'pointer' }}
                                            title="رفض التوثيق"
                                          >
                                            <XCircle size={14} />
                                          </button>
                                        )}
                                      </>
                                    )}
                                    <button 
                                      onClick={() => deleteProfile(p.id)}
                                      style={{ padding: 6, borderRadius: 8, border: '1px solid rgba(239,68,68,0.1)', background: 'rgba(127,29,29,0.2)', color: '#ef4444', cursor: 'pointer' }}
                                      title="حذف الحساب"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ===== BOOKINGS TAB ===== */}
              {activeTab === 'bookings' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <div style={{ background: '#0A0D1A', borderRadius: 24, border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', textAlign: 'right', borderCollapse: 'collapse', fontSize: 12 }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: '#0E1224', color: '#9ca3af', fontWeight: 700 }}>
                            <th style={{ padding: 16 }}>الخدمة</th>
                            <th style={{ padding: 16 }}>العميل</th>
                            <th style={{ padding: 16 }}>الحرفي</th>
                            <th style={{ padding: 16 }}>الموعد</th>
                            <th style={{ padding: 16 }}>المبلغ والدفع</th>
                            <th style={{ padding: 16 }}>الحالة</th>
                            <th style={{ padding: 16, textAlign: 'center' }}>العمليات</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bookingsList.map((b) => {
                            const statusStyles: Record<string, { bg: string; color: string; label: string }> = {
                              completed: { bg: 'rgba(34,197,94,0.1)', color: '#4ade80', label: 'مكتمل' },
                              cancelled: { bg: 'rgba(239,68,68,0.1)', color: '#f87171', label: 'ملغي' },
                              active: { bg: 'rgba(59,130,246,0.1)', color: '#60a5fa', label: 'نشط' }
                            }
                            const st = statusStyles[b.status] || { bg: 'rgba(234,179,8,0.1)', color: '#facc15', label: 'قيد الانتظار' }
                            return (
                              <tr key={b.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: 16, fontWeight: 700, color: '#fff' }}>{b.service_name}</td>
                                <td style={{ padding: 16 }}>
                                  <div style={{ fontWeight: 600 }}>{b.client?.full_name || 'عميل'}</div>
                                  <div style={{ fontSize: 10, color: '#6b7280' }}>{b.client?.phone || '-'}</div>
                                </td>
                                <td style={{ padding: 16 }}>
                                  <div style={{ fontWeight: 600 }}>{b.worker?.full_name || 'حرفي'}</div>
                                  <div style={{ fontSize: 10, color: '#6b7280' }}>{b.worker?.phone || '-'}</div>
                                </td>
                                <td style={{ padding: 16 }}>
                                  <div>{b.appointment_date}</div>
                                  <div style={{ fontSize: 10, color: '#6b7280' }}>{b.appointment_time?.slice(0,5)}</div>
                                </td>
                                <td style={{ padding: 16 }}>
                                  <div style={{ fontWeight: 700, color: '#FF8A00' }}>{b.total_amount} ج.م</div>
                                  <div style={{ fontSize: 10, color: '#6b7280', textTransform: 'uppercase' }}>{b.payment_method}</div>
                                </td>
                                <td style={{ padding: 16 }}>
                                  <span style={{ padding: '2px 8px', borderRadius: 9999, fontSize: 9, fontWeight: 700, background: st.bg, color: st.color }}>{st.label}</span>
                                </td>
                                <td style={{ padding: 16 }}>
                                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                                    {b.status !== 'completed' && b.status !== 'cancelled' && (
                                      <>
                                        <button onClick={() => updateBookingStatus(b.id, 'completed')} style={{ borderRadius: 8, background: 'rgba(20,83,45,0.2)', border: '1px solid rgba(34,197,94,0.1)', color: '#22c55e', fontSize: 10, padding: '4px 8px', cursor: 'pointer', fontFamily: 'inherit' }}>إكمال</button>
                                        <button onClick={() => updateBookingStatus(b.id, 'cancelled')} style={{ borderRadius: 8, background: 'rgba(127,29,29,0.2)', border: '1px solid rgba(239,68,68,0.1)', color: '#ef4444', fontSize: 10, padding: '4px 8px', cursor: 'pointer', fontFamily: 'inherit' }}>إلغاء</button>
                                      </>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ===== EMERGENCIES TAB ===== */}
              {activeTab === 'emergencies' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <div style={{ background: '#0A0D1A', borderRadius: 24, border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', textAlign: 'right', borderCollapse: 'collapse', fontSize: 12 }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: '#0E1224', color: '#9ca3af', fontWeight: 700 }}>
                            <th style={{ padding: 16 }}>نوع الطوارئ</th>
                            <th style={{ padding: 16 }}>العميل</th>
                            <th style={{ padding: 16 }}>الحرفي المعين</th>
                            <th style={{ padding: 16 }}>العنوان</th>
                            <th style={{ padding: 16 }}>الحالة</th>
                            <th style={{ padding: 16 }}>تاريخ البلاغ</th>
                          </tr>
                        </thead>
                        <tbody>
                          {emergenciesList.map((e) => {
                            const typeLabels: Record<string, string> = {
                              'water-leak': 'تسريب مياه', 'power-cut': 'انقطاع كهرباء', 'door-break': 'كسر باب',
                              'fire': 'حريق', 'gas': 'تسريب غاز', 'other': 'أخرى'
                            }
                            return (
                              <tr key={e.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: 16, fontWeight: 700, color: '#f87171', display: 'flex', alignItems: 'center', gap: 8 }}>
                                  <AlertCircle size={14} />
                                  <span>{typeLabels[e.type] || 'أخرى'}</span>
                                </td>
                                <td style={{ padding: 16 }}>
                                  <div style={{ fontWeight: 600 }}>{e.client?.full_name || 'عميل'}</div>
                                  <div style={{ fontSize: 10, color: '#6b7280' }}>{e.client?.phone || '-'}</div>
                                </td>
                                <td style={{ padding: 16, color: '#d1d5db' }}>
                                  {e.worker?.full_name || <span style={{ color: '#6b7280' }}>جاري البحث عن حرفي...</span>}
                                </td>
                                <td style={{ padding: 16, color: '#9ca3af' }}>{e.address}</td>
                                <td style={{ padding: 16 }}>
                                  <span style={{
                                    padding: '2px 8px', borderRadius: 9999, fontSize: 9, fontWeight: 700,
                                    background: e.status === 'completed' ? 'rgba(34,197,94,0.1)' : e.status === 'in-progress' ? 'rgba(59,130,246,0.1)' : 'rgba(239,68,68,0.1)',
                                    color: e.status === 'completed' ? '#4ade80' : e.status === 'in-progress' ? '#60a5fa' : '#f87171'
                                  }}>
                                    {e.status === 'completed' ? 'مكتمل' : e.status === 'in-progress' ? 'قيد العمل' : 'معلق'}
                                  </span>
                                </td>
                                <td style={{ padding: 16, color: '#6b7280' }}>
                                  {new Date(e.created_at).toLocaleString('ar-EG', { dateStyle: 'short', timeStyle: 'short' })}
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ===== SERVICES TAB ===== */}
              {activeTab === 'services' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <div style={{ background: '#0A0D1A', borderRadius: 24, border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', textAlign: 'right', borderCollapse: 'collapse', fontSize: 12 }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: '#0E1224', color: '#9ca3af', fontWeight: 700 }}>
                            <th style={{ padding: 16 }}>اسم الخدمة</th>
                            <th style={{ padding: 16 }}>السعر</th>
                            <th style={{ padding: 16 }}>الحرفي</th>
                            <th style={{ padding: 16, textAlign: 'center' }}>العمليات</th>
                          </tr>
                        </thead>
                        <tbody>
                          {servicesList.length === 0 ? (
                            <tr>
                              <td colSpan={4} style={{ padding: 32, textAlign: 'center', color: '#6b7280' }}>لا توجد خدمات مسجلة</td>
                            </tr>
                          ) : servicesList.map((s) => (
                            <tr key={s.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                              <td style={{ padding: 16, fontWeight: 700, color: '#fff' }}>{s.name}</td>
                              <td style={{ padding: 16, fontWeight: 700, color: '#FF8A00' }}>{s.price} ج.م</td>
                              <td style={{ padding: 16 }}>{s.worker?.full_name || 'حرفي'}</td>
                              <td style={{ padding: 16 }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                                  <button onClick={() => setEditingService(s)} style={{ padding: 6, borderRadius: 8, border: '1px solid rgba(59,130,246,0.1)', background: 'rgba(30,58,138,0.2)', color: '#60a5fa', cursor: 'pointer' }}>
                                    <Edit size={14} />
                                  </button>
                                  <button onClick={async () => {
                                    if (!confirm('حذف هذه الخدمة؟')) return
                                    await supabase.from('services').delete().eq('id', s.id)
                                    fetchData()
                                  }} style={{ padding: 6, borderRadius: 8, border: '1px solid rgba(239,68,68,0.1)', background: 'rgba(127,29,29,0.2)', color: '#ef4444', cursor: 'pointer' }}>
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ===== CATEGORIES TAB ===== */}
              {activeTab === 'categories' && (
                <div className="flex flex-col md:flex-row gap-4 md:gap-8">
                  {/* Add Form */}
                  <div className="w-full md:w-[280px] flex-shrink-0" style={{ background: '#0A0D1A', borderRadius: 24, padding: 24, border: '1px solid rgba(255,255,255,0.05)', alignSelf: 'flex-start' }}>
                    <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Plus size={16} style={{ color: '#FF8A00' }} />
                      <span>إضافة قسم جديد</span>
                    </h3>
                    <form onSubmit={addCategory} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <label style={{ fontSize: 10, color: '#9ca3af', fontWeight: 700 }}>الاسم بالعربية</label>
                        <input type="text" required value={newCatAr} onChange={e => setNewCatAr(e.target.value)}
                          style={{ background: '#050814', fontSize: 12, borderRadius: 12, padding: '12px 16px', border: '1px solid rgba(255,255,255,0.05)', outline: 'none', color: '#fff', fontFamily: 'inherit' }}
                          placeholder="مثال: سباكة" />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <label style={{ fontSize: 10, color: '#9ca3af', fontWeight: 700 }}>الاسم بالإنجليزية</label>
                        <input type="text" required value={newCatEn} onChange={e => setNewCatEn(e.target.value)}
                          style={{ background: '#050814', fontSize: 12, borderRadius: 12, padding: '12px 16px', border: '1px solid rgba(255,255,255,0.05)', outline: 'none', color: '#fff', textAlign: 'left', fontFamily: 'inherit' }}
                          placeholder="Example: Plumbing" />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <label style={{ fontSize: 10, color: '#9ca3af', fontWeight: 700 }}>اسم الأيقونة (Lucide Icon)</label>
                        <input type="text" required value={newCatIcon} onChange={e => setNewCatIcon(e.target.value)}
                          style={{ background: '#050814', fontSize: 12, borderRadius: 12, padding: '12px 16px', border: '1px solid rgba(255,255,255,0.05)', outline: 'none', color: '#fff', fontFamily: 'inherit' }}
                          placeholder="Wrench, Paintbrush, Zap..." />
                      </div>
                      <button type="submit" style={{ width: '100%', background: 'linear-gradient(90deg, #FF8A00, #FFB800)', color: '#000', fontWeight: 900, fontSize: 12, padding: '12px 0', borderRadius: 12, border: 'none', cursor: 'pointer', marginTop: 8, fontFamily: 'inherit' }}>
                        إضافة القسم
                      </button>
                    </form>
                  </div>

                  {/* Categories Table */}
                  <div style={{ flex: 1, minWidth: 0, background: '#0A0D1A', borderRadius: 24, border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden', alignSelf: 'flex-start' }}>
                    <table style={{ width: '100%', textAlign: 'right', borderCollapse: 'collapse', fontSize: 12 }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: '#0E1224', color: '#9ca3af', fontWeight: 700 }}>
                          <th style={{ padding: 16 }}>القسم بالعربية</th>
                          <th style={{ padding: 16 }}>القسم بالإنجليزية</th>
                          <th style={{ padding: 16 }}>أيقونة</th>
                          <th style={{ padding: 16 }}>عدد الحرفيين</th>
                          <th style={{ padding: 16, textAlign: 'center' }}>حذف</th>
                        </tr>
                      </thead>
                      <tbody>
                        {categoriesList.map((c) => (
                          <tr key={c.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <td style={{ padding: 16, fontWeight: 700, color: '#fff' }}>{c.label_ar}</td>
                            <td style={{ padding: 16, fontWeight: 600, color: '#d1d5db' }}>{c.label_en}</td>
                            <td style={{ padding: 16, color: '#9ca3af', fontFamily: 'monospace' }}>{c.icon}</td>
                            <td style={{ padding: 16, fontWeight: 700, color: '#FF8A00' }}>{c.usage_count || 0}</td>
                            <td style={{ padding: 16 }}>
                              <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <button onClick={() => deleteCategory(c.id)} style={{ padding: 6, borderRadius: 8, border: '1px solid rgba(239,68,68,0.1)', background: 'rgba(127,29,29,0.2)', color: '#ef4444', cursor: 'pointer' }}>
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ===== REVIEWS TAB ===== */}
              {activeTab === 'reviews' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <div style={{ background: '#0A0D1A', borderRadius: 24, border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', textAlign: 'right', borderCollapse: 'collapse', fontSize: 12 }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: '#0E1224', color: '#9ca3af', fontWeight: 700 }}>
                            <th style={{ padding: 16 }}>العميل</th>
                            <th style={{ padding: 16 }}>الحرفي</th>
                            <th style={{ padding: 16 }}>التقييم</th>
                            <th style={{ padding: 16 }}>التعليق</th>
                            <th style={{ padding: 16 }}>التاريخ</th>
                            <th style={{ padding: 16, textAlign: 'center' }}>حذف</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reviewsList.length === 0 ? (
                            <tr>
                              <td colSpan={6} style={{ padding: 32, textAlign: 'center', color: '#6b7280' }}>لا توجد تقييمات</td>
                            </tr>
                          ) : reviewsList.map((r) => (
                            <tr key={r.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                              <td style={{ padding: 16, fontWeight: 600, color: '#fff' }}>{r.client?.full_name || 'عميل'}</td>
                              <td style={{ padding: 16 }}>{r.worker?.full_name || 'حرفي'}</td>
                              <td style={{ padding: 16 }}>
                                <span style={{ color: '#FFB800', fontWeight: 700 }}>{'★'.repeat(Math.round(r.rating || 0))}{'☆'.repeat(5 - Math.round(r.rating || 0))}</span>
                              </td>
                              <td style={{ padding: 16, color: '#d1d5db', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.text || '-'}</td>
                              <td style={{ padding: 16, color: '#6b7280' }}>{r.created_at ? new Date(r.created_at).toLocaleDateString('ar-EG') : '-'}</td>
                              <td style={{ padding: 16 }}>
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                  <button onClick={async () => {
                                    if (!confirm('حذف هذا التقييم؟')) return
                                    await supabase.from('reviews').delete().eq('id', r.id)
                                    fetchData()
                                  }} style={{ padding: 6, borderRadius: 8, border: '1px solid rgba(239,68,68,0.1)', background: 'rgba(127,29,29,0.2)', color: '#ef4444', cursor: 'pointer' }}>
                                    <Trash2 size={12} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ===== TRANSACTIONS TAB ===== */}
              {activeTab === 'transactions' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <div style={{ background: '#0A0D1A', borderRadius: 24, border: '1px solid rgba(255,255,255,0.05)', padding: 24 }}>
                    <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: '#FF8A00' }}>إجمالي المعاملات المالية</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16, marginBottom: 24 }}>
                      <div style={{ background: '#050814', padding: 16, borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ fontSize: 11, color: '#6b7280' }}>إجمالي الودائع</div>
                        <div style={{ fontSize: 24, fontWeight: 900, color: '#22c55e', marginTop: 4 }}>
                          {transactionsList.filter(t => t.type === 'deposit').reduce((a, t) => a + Number(t.amount || 0), 0)} ج.م
                        </div>
                      </div>
                      <div style={{ background: '#050814', padding: 16, borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ fontSize: 11, color: '#6b7280' }}>إجمالي المدفوعات</div>
                        <div style={{ fontSize: 24, fontWeight: 900, color: '#ef4444', marginTop: 4 }}>
                          {transactionsList.filter(t => t.type === 'payment').reduce((a, t) => a + Number(t.amount || 0), 0)} ج.م
                        </div>
                      </div>
                      <div style={{ background: '#050814', padding: 16, borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ fontSize: 11, color: '#6b7280' }}>إجمالي المستردات</div>
                        <div style={{ fontSize: 24, fontWeight: 900, color: '#facc15', marginTop: 4 }}>
                          {transactionsList.filter(t => t.type === 'refund').reduce((a, t) => a + Number(t.amount || 0), 0)} ج.م
                        </div>
                      </div>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', textAlign: 'right', borderCollapse: 'collapse', fontSize: 12 }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: '#0E1224', color: '#9ca3af', fontWeight: 700 }}>
                            <th style={{ padding: 16 }}>المستخدم</th>
                            <th style={{ padding: 16 }}>النوع</th>
                            <th style={{ padding: 16 }}>المبلغ</th>
                            <th style={{ padding: 16 }}>الوصف</th>
                            <th style={{ padding: 16 }}>التاريخ</th>
                          </tr>
                        </thead>
                        <tbody>
                          {transactionsList.length === 0 ? (
                            <tr>
                              <td colSpan={5} style={{ padding: 32, textAlign: 'center', color: '#6b7280' }}>لا توجد معاملات مالية</td>
                            </tr>
                          ) : transactionsList.map((t) => (
                            <tr key={t.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                              <td style={{ padding: 16, fontWeight: 600, color: '#fff' }}>{t.user?.full_name || 'مستخدم'}</td>
                              <td style={{ padding: 16 }}>
                                <span style={{
                                  padding: '2px 8px', borderRadius: 9999, fontSize: 9, fontWeight: 700,
                                  background: t.type === 'deposit' ? 'rgba(34,197,94,0.1)' : t.type === 'payment' ? 'rgba(239,68,68,0.1)' : 'rgba(234,179,8,0.1)',
                                  color: t.type === 'deposit' ? '#22c55e' : t.type === 'payment' ? '#ef4444' : '#facc15'
                                }}>
                                  {t.type === 'deposit' ? 'إيداع' : t.type === 'payment' ? 'دفع' : 'استرداد'}
                                </span>
                              </td>
                              <td style={{ padding: 16, fontWeight: 700, color: t.type === 'deposit' ? '#22c55e' : '#ef4444' }}>{t.amount} ج.م</td>
                              <td style={{ padding: 16, color: '#d1d5db' }}>{t.description || '-'}</td>
                              <td style={{ padding: 16, color: '#6b7280' }}>{t.created_at ? new Date(t.created_at).toLocaleDateString('ar-EG') : '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ===== GALLERY TAB ===== */}
              {activeTab === 'gallery' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <div style={{ background: '#0A0D1A', borderRadius: 24, border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', textAlign: 'right', borderCollapse: 'collapse', fontSize: 12 }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: '#0E1224', color: '#9ca3af', fontWeight: 700 }}>
                            <th style={{ padding: 16 }}>الصورة</th>
                            <th style={{ padding: 16 }}>العنوان</th>
                            <th style={{ padding: 16 }}>الحرفي</th>
                            <th style={{ padding: 16, textAlign: 'center' }}>حذف</th>
                          </tr>
                        </thead>
                        <tbody>
                          {galleryList.length === 0 ? (
                            <tr>
                              <td colSpan={4} style={{ padding: 32, textAlign: 'center', color: '#6b7280' }}>لا توجد صور في المعرض</td>
                            </tr>
                          ) : galleryList.map((g) => (
                            <tr key={g.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                              <td style={{ padding: 16 }}>
                                <img src={g.image_url} style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)' }} />
                              </td>
                              <td style={{ padding: 16, color: '#fff', fontWeight: 600 }}>{g.title || 'بدون عنوان'}</td>
                              <td style={{ padding: 16 }}>{g.worker?.full_name || 'حرفي'}</td>
                              <td style={{ padding: 16 }}>
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                  <button onClick={async () => {
                                    if (!confirm('حذف هذه الصورة؟')) return
                                    await supabase.from('worker_gallery').delete().eq('id', g.id)
                                    fetchData()
                                  }} style={{ padding: 6, borderRadius: 8, border: '1px solid rgba(239,68,68,0.1)', background: 'rgba(127,29,29,0.2)', color: '#ef4444', cursor: 'pointer' }}>
                                    <Trash2 size={12} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ===== NOTIFICATIONS TAB ===== */}
              {activeTab === 'notifications' && (
                <div className="flex flex-col md:flex-row gap-4 md:gap-8">
                  <div className="w-full md:w-[320px] flex-shrink-0" style={{ background: '#0A0D1A', borderRadius: 24, padding: 24, border: '1px solid rgba(255,255,255,0.05)', alignSelf: 'flex-start' }}>
                    <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Send size={16} style={{ color: '#FF8A00' }} />
                      <span>إرسال إشعار عام</span>
                    </h3>
                    <form onSubmit={async (e) => {
                      e.preventDefault()
                      if (!notifTitle.trim() || !notifBody.trim()) return
                      setSendingNotif(true)
                      try {
                        const { data: allUsers } = await supabase.from('profiles').select('id')
                        if (allUsers) {
                          const inserts = allUsers.map(u => ({
                            user_id: u.id,
                            title: notifTitle.trim(),
                            body: notifBody.trim()
                          }))
                          const { error } = await supabase.from('notifications').insert(inserts)
                          if (error) throw error
                        }
                        setNotifTitle('')
                        setNotifBody('')
                        fetchData()
                        alert('تم إرسال الإشعار لجميع المستخدمين')
                      } catch (err) {
                        alert('فشل إرسال الإشعار')
                      } finally {
                        setSendingNotif(false)
                      }
                    }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <label style={{ fontSize: 10, color: '#9ca3af', fontWeight: 700 }}>عنوان الإشعار</label>
                        <input type="text" required value={notifTitle} onChange={e => setNotifTitle(e.target.value)}
                          style={{ background: '#050814', fontSize: 12, borderRadius: 12, padding: '12px 16px', border: '1px solid rgba(255,255,255,0.05)', outline: 'none', color: '#fff', fontFamily: 'inherit' }}
                          placeholder="مثال: عروض حصرية" />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <label style={{ fontSize: 10, color: '#9ca3af', fontWeight: 700 }}>نص الإشعار</label>
                        <textarea required value={notifBody} onChange={e => setNotifBody(e.target.value)} rows={4}
                          style={{ background: '#050814', fontSize: 12, borderRadius: 12, padding: '12px 16px', border: '1px solid rgba(255,255,255,0.05)', outline: 'none', color: '#fff', fontFamily: 'inherit', resize: 'vertical' }}
                          placeholder="اكتب محتوى الإشعار..." />
                      </div>
                      <button type="submit" disabled={sendingNotif}
                        style={{ width: '100%', background: sendingNotif ? 'rgba(255,138,0,0.3)' : 'linear-gradient(90deg, #FF8A00, #FFB800)', color: '#000', fontWeight: 900, fontSize: 12, padding: '12px 0', borderRadius: 12, border: 'none', cursor: sendingNotif ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
                        {sendingNotif ? 'جاري الإرسال...' : 'إرسال الإشعار للجميع'}
                      </button>
                    </form>
                  </div>
                  <div style={{ flex: 1, minWidth: 0, background: '#0A0D1A', borderRadius: 24, border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden', alignSelf: 'flex-start' }}>
                    <div style={{ padding: 16, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <h3 style={{ fontSize: 14, fontWeight: 700, color: '#FF8A00' }}>الإشعارات المرسلة</h3>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', textAlign: 'right', borderCollapse: 'collapse', fontSize: 12 }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: '#0E1224', color: '#9ca3af', fontWeight: 700 }}>
                            <th style={{ padding: 16 }}>العنوان</th>
                            <th style={{ padding: 16 }}>المحتوى</th>
                            <th style={{ padding: 16 }}>المستخدم</th>
                            <th style={{ padding: 16 }}>مقروء</th>
                            <th style={{ padding: 16 }}>التاريخ</th>
                          </tr>
                        </thead>
                        <tbody>
                          {notificationsList.length === 0 ? (
                            <tr>
                              <td colSpan={5} style={{ padding: 32, textAlign: 'center', color: '#6b7280' }}>لا توجد إشعارات</td>
                            </tr>
                          ) : notificationsList.map((n) => (
                            <tr key={n.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                              <td style={{ padding: 16, fontWeight: 700, color: '#fff' }}>{n.title}</td>
                              <td style={{ padding: 16, color: '#d1d5db', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.body}</td>
                              <td style={{ padding: 16 }}>{n.user?.full_name || 'مستخدم'}</td>
                              <td style={{ padding: 16 }}>
                                <span style={{
                                  padding: '2px 8px', borderRadius: 9999, fontSize: 9, fontWeight: 700,
                                  background: n.is_read ? 'rgba(34,197,94,0.1)' : 'rgba(234,179,8,0.1)',
                                  color: n.is_read ? '#22c55e' : '#facc15'
                                }}>
                                  {n.is_read ? 'مقروء' : 'جديد'}
                                </span>
                              </td>
                              <td style={{ padding: 16, color: '#6b7280' }}>{n.created_at ? new Date(n.created_at).toLocaleDateString('ar-EG') : '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ===== RULES TAB ===== */}
              {activeTab === 'rules' && (
                <div className="flex flex-col md:flex-row gap-4 md:gap-8">
                  {/* Add Rule Form */}
                  <div className="w-full md:w-[280px] flex-shrink-0" style={{ background: '#0A0D1A', borderRadius: 24, padding: 24, border: '1px solid rgba(255,255,255,0.05)', alignSelf: 'flex-start' }}>
                    <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Plus size={16} style={{ color: '#FF8A00' }} />
                      <span>إضافة بريد/نطاق أدمن</span>
                    </h3>
                    <form onSubmit={addRule} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <label style={{ fontSize: 10, color: '#9ca3af', fontWeight: 700 }}>البريد الإلكتروني أو النطاق</label>
                        <input type="text" required value={newRulePattern} onChange={e => setNewRulePattern(e.target.value)}
                          style={{ background: '#050814', fontSize: 12, borderRadius: 12, padding: '12px 16px', border: '1px solid rgba(255,255,255,0.05)', outline: 'none', color: '#fff', fontFamily: 'inherit' }}
                          placeholder="مثال: email@gmail.com أو @domain.com" />
                        <span style={{ fontSize: 9, color: '#6b7280', marginTop: 4 }}>يمكنك إدخال بريد محدد أو نطاق كامل يبدأ بـ @</span>
                      </div>
                      <button type="submit" style={{ width: '100%', background: 'linear-gradient(90deg, #FF8A00, #FFB800)', color: '#000', fontWeight: 900, fontSize: 12, padding: '12px 0', borderRadius: 12, border: 'none', cursor: 'pointer', marginTop: 8, fontFamily: 'inherit' }}>
                        إضافة قاعدة
                      </button>
                    </form>
                  </div>

                  {/* Rules Table */}
                  <div style={{ flex: 1, minWidth: 0, background: '#0A0D1A', borderRadius: 24, border: '1px solid rgba(255,255,255,0.05)', overflowX: 'auto', alignSelf: 'flex-start' }}>
                    <table style={{ width: '100%', minWidth: 400, textAlign: 'right', borderCollapse: 'collapse', fontSize: 12 }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: '#0E1224', color: '#9ca3af', fontWeight: 700 }}>
                          <th style={{ padding: 16 }}>القاعدة / البريد المسموح له</th>
                          <th style={{ padding: 16 }}>تاريخ الإضافة</th>
                          <th style={{ padding: 16, textAlign: 'center' }}>حذف</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rulesList.map((r) => (
                          <tr key={r.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <td style={{ padding: 16, fontWeight: 700, color: '#fff', fontFamily: 'monospace' }}>{r.pattern}</td>
                            <td style={{ padding: 16, color: '#9ca3af' }}>
                              {new Date(r.created_at).toLocaleDateString('ar-EG')}
                            </td>
                            <td style={{ padding: 16 }}>
                              <div style={{ display: 'flex', justifyContent: 'center' }}>
                                {r.pattern !== 'unshreif@gmail.com' && r.pattern !== 'moonbysun4@gmail.com' ? (
                                  <button onClick={() => deleteRule(r.id)} style={{ padding: 6, borderRadius: 8, border: '1px solid rgba(239,68,68,0.1)', background: 'rgba(127,29,29,0.2)', color: '#ef4444', cursor: 'pointer' }}>
                                    <Trash2 size={12} />
                                  </button>
                                ) : (
                                  <span style={{ fontSize: 10, color: '#6b7280' }}>أساسي</span>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ===== MESSAGES TAB ===== */}
              {activeTab === 'messages' && (
                <div className="flex flex-col md:flex-row gap-4 md:gap-8">
                  {/* User Selection */}
                  <div className="w-full md:w-[320px] flex-shrink-0" style={{ background: '#0A0D1A', borderRadius: 24, padding: 24, border: '1px solid rgba(255,255,255,0.05)', alignSelf: 'flex-start', maxHeight: '70vh', overflowY: 'auto' }}>
                    <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <MessageSquare size={16} style={{ color: '#FF8A00' }} />
                      <span>اختر مستخدم</span>
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {profilesList.filter(p => p.role !== 'admin').map((user) => (
                        <button
                          key={user.id}
                          onClick={() => setSelectedUser(user)}
                          style={{
                            width: '100%',
                            padding: 12,
                            borderRadius: 12,
                            border: selectedUser?.id === user.id ? '1px solid #FF8A00' : '1px solid rgba(255,255,255,0.05)',
                            background: selectedUser?.id === user.id ? 'rgba(255,138,0,0.1)' : '#050814',
                            cursor: 'pointer',
                            textAlign: 'right',
                            transition: 'all 0.2s'
                          }}
                        >
                          <div style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{user.full_name || 'مستخدم'}</div>
                          <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 4 }}>{user.email}</div>
                          <div style={{ fontSize: 10, color: user.role === 'client' ? '#3b82f6' : '#f59e0b', marginTop: 2 }}>
                            {user.role === 'client' ? 'عميل' : 'حرفي'}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Message Form */}
                  <div style={{ flex: 1, minWidth: 0, background: '#0A0D1A', borderRadius: 24, padding: 24, border: '1px solid rgba(255,255,255,0.05)', alignSelf: 'flex-start' }}>
                    {selectedUser ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#0F1322', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: '#FF8A00' }}>
                            {(selectedUser.full_name || 'م')[0]}
                          </div>
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{selectedUser.full_name || 'مستخدم'}</div>
                            <div style={{ fontSize: 11, color: '#9ca3af' }}>{selectedUser.email}</div>
                            <div style={{ fontSize: 10, color: selectedUser.role === 'client' ? '#3b82f6' : '#f59e0b', marginTop: 2 }}>
                              {selectedUser.role === 'client' ? 'عميل' : 'حرفي'}
                            </div>
                          </div>
                        </div>

                        <form onSubmit={sendMessage} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            <label style={{ fontSize: 10, color: '#9ca3af', fontWeight: 700 }}>نص الرسالة</label>
                            <textarea
                              required
                              value={messageText}
                              onChange={e => setMessageText(e.target.value)}
                              placeholder="اكتب رسالتك هنا..."
                              rows={6}
                              style={{
                                background: '#050814',
                                fontSize: 12,
                                borderRadius: 12,
                                padding: '12px 16px',
                                border: '1px solid rgba(255,255,255,0.05)',
                                outline: 'none',
                                color: '#fff',
                                fontFamily: 'inherit',
                                resize: 'vertical',
                                minHeight: 120
                              }}
                            />
                          </div>
                          <button
                            type="submit"
                            disabled={sendingMessage || !messageText.trim()}
                            style={{
                              width: '100%',
                              background: sendingMessage ? 'rgba(255,138,0,0.3)' : 'linear-gradient(90deg, #FF8A00, #FFB800)',
                              color: '#000',
                              fontWeight: 900,
                              fontSize: 12,
                              padding: '12px 0',
                              borderRadius: 12,
                              border: 'none',
                              cursor: sendingMessage ? 'not-allowed' : 'pointer',
                              fontFamily: 'inherit',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: 8
                            }}
                          >
                            {sendingMessage ? 'جاري الإرسال...' : (
                              <>
                                <Send size={14} />
                                <span>إرسال الرسالة</span>
                              </>
                            )}
                          </button>
                        </form>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300, color: '#6b7280' }}>
                        <MessageSquare size={48} style={{ marginBottom: 16, opacity: 0.5 }} />
                        <span style={{ fontSize: 12 }}>اختر مستخدماً لإرسال رسالة</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* User Details Modal */}
      {viewUserDetails && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={() => setViewUserDetails(null)}>
          <div style={{ background: '#0A0D1A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24, width: '100%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: 24, borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: '#0A0D1A', zIndex: 10 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>تفاصيل المستخدم</h2>
              <button onClick={() => setViewUserDetails(null)} style={{ background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer' }}><XCircle size={24} /></button>
            </div>
            <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24, fontSize: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <img src={viewUserDetails.avatar_url || '/craftsman_avatar.png'} style={{ width: 80, height: 80, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.1)', objectFit: 'cover' }} />
                <div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>{viewUserDetails.full_name}</div>
                  <div style={{ color: '#9ca3af', marginTop: 4 }}>{viewUserDetails.email}</div>
                  <span style={{ display: 'inline-block', marginTop: 8, padding: '4px 12px', borderRadius: 9999, fontSize: 11, fontWeight: 700, background: viewUserDetails.role === 'worker' ? 'rgba(255,138,0,0.1)' : viewUserDetails.role === 'admin' ? 'rgba(168,85,247,0.1)' : 'rgba(59,130,246,0.1)', color: viewUserDetails.role === 'worker' ? '#FF8A00' : viewUserDetails.role === 'admin' ? '#a855f7' : '#60a5fa' }}>{viewUserDetails.role === 'worker' ? 'حرفي' : viewUserDetails.role === 'admin' ? 'أدمن' : 'عميل'}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div style={{ background: '#050814', padding: 16, borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>رقم الهاتف</div>
                  <div style={{ color: '#fff', fontWeight: 700 }}>{viewUserDetails.phone || 'غير محدد'}</div>
                </div>
                <div style={{ background: '#050814', padding: 16, borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>العنوان</div>
                  <div style={{ color: '#fff', fontWeight: 700 }}>{viewUserDetails.governorate ? `${viewUserDetails.governorate} - ${viewUserDetails.area}` : 'غير محدد'}</div>
                </div>
                <div style={{ background: '#050814', padding: 16, borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>تاريخ الانضمام</div>
                  <div style={{ color: '#fff', fontWeight: 700 }}>{viewUserDetails.created_at ? new Date(viewUserDetails.created_at).toLocaleDateString('ar-EG') : 'غير محدد'}</div>
                </div>
                <div style={{ background: '#050814', padding: 16, borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>حالة التوثيق</div>
                  <div style={{ fontWeight: 700, color: viewUserDetails.verified || viewUserDetails.role === 'admin' ? '#22c55e' : '#eab308' }}>{viewUserDetails.verified || viewUserDetails.role === 'admin' ? 'موثق' : 'غير موثق'}</div>
                </div>
              </div>

              {viewUserDetails.role === 'worker' && (
                <>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginTop: 8, borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 8 }}>بيانات الحرفي</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div style={{ background: '#050814', padding: 16, borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>المهنة</div>
                      <div style={{ color: '#fff', fontWeight: 700 }}>{viewUserDetails.profession || 'غير محدد'}</div>
                    </div>
                    <div style={{ background: '#050814', padding: 16, borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>المستوى</div>
                      <div style={{ color: '#fff', fontWeight: 700 }}>{viewUserDetails.category_level || 'جديد'}</div>
                    </div>
                    <div style={{ background: '#050814', padding: 16, borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>الطلبات المنجزة</div>
                      <div style={{ color: '#fff', fontWeight: 700 }}>{viewUserDetails.completed_orders || 0}</div>
                    </div>
                    <div style={{ background: '#050814', padding: 16, borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>إجمالي الأرباح</div>
                      <div style={{ color: '#fff', fontWeight: 700 }}>{viewUserDetails.total_earnings || 0} ج.م</div>
                    </div>
                    <div style={{ background: '#050814', padding: 16, borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>التقييم</div>
                      <div style={{ color: '#FFB800', fontWeight: 700 }}>{viewUserDetails.rating || 0} ⭐</div>
                    </div>
                    <div style={{ background: '#050814', padding: 16, borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>سرعة الاستجابة</div>
                      <div style={{ color: '#fff', fontWeight: 700 }}>{viewUserDetails.response_rate || 100}%</div>
                    </div>
                  </div>
                  
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginTop: 8, borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 8 }}>المرفقات والصور</h3>
                  <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                    {viewUserDetails.id_front_url && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <span style={{ fontSize: 11, color: '#6b7280' }}>البطاقة (أمامي)</span>
                        <a href={viewUserDetails.id_front_url} target="_blank" rel="noreferrer">
                          <img src={viewUserDetails.id_front_url} style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)' }} />
                        </a>
                      </div>
                    )}
                    {viewUserDetails.id_back_url && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <span style={{ fontSize: 11, color: '#6b7280' }}>البطاقة (خلفي)</span>
                        <a href={viewUserDetails.id_back_url} target="_blank" rel="noreferrer">
                          <img src={viewUserDetails.id_back_url} style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)' }} />
                        </a>
                      </div>
                    )}
                    {viewUserDetails.portfolio_urls && Array.isArray(viewUserDetails.portfolio_urls) && viewUserDetails.portfolio_urls.map((img: string, idx: number) => (
                      <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <span style={{ fontSize: 11, color: '#6b7280' }}>عمل {idx + 1}</span>
                        <a href={img} target="_blank" rel="noreferrer">
                          <img src={img} style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)' }} />
                        </a>
                      </div>
                    ))}
                    {!viewUserDetails.id_front_url && !viewUserDetails.id_back_url && (!viewUserDetails.portfolio_urls || viewUserDetails.portfolio_urls.length === 0) && (
                      <div style={{ color: '#6b7280', fontSize: 12, padding: '16px 0' }}>لا يوجد مرفقات مسجلة لهذا الحرفي</div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Reject User Modal */}
      {rejectUser && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={() => setRejectUser(null)}>
          <div style={{ background: '#0A0D1A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24, width: '100%', maxWidth: 400, padding: 24 }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 16 }}>سبب رفض التوثيق</h3>
            <p style={{ fontSize: 12, color: '#9ca3af', marginBottom: 16 }}>سيتم إرسال هذا السبب للحرفي ({rejectUser.full_name}) ليتمكن من تصحيحه وإعادة رفع المستندات.</p>
            <form onSubmit={submitRejectUser} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <textarea 
                required
                value={rejectionReason}
                onChange={e => setRejectionReason(e.target.value)}
                placeholder="اكتب سبب الرفض هنا... (مثال: الصورة غير واضحة، البطاقة منتهية الصلاحية)"
                style={{ background: '#050814', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 16, color: '#fff', minHeight: 100, outline: 'none', resize: 'vertical' }}
              />
              <div style={{ display: 'flex', gap: 12 }}>
                <button type="submit" disabled={isRejecting} style={{ flex: 1, background: '#ef4444', color: '#fff', padding: 12, borderRadius: 12, border: 'none', fontWeight: 700, cursor: isRejecting ? 'not-allowed' : 'pointer', opacity: isRejecting ? 0.7 : 1 }}>
                  {isRejecting ? 'جاري الرفض...' : 'تأكيد الرفض'}
                </button>
                <button type="button" onClick={() => setRejectUser(null)} style={{ flex: 1, background: 'rgba(255,255,255,0.1)', color: '#fff', padding: 12, borderRadius: 12, border: 'none', fontWeight: 700, cursor: 'pointer' }}>إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Service Modal */}
      {editingService && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={() => setEditingService(null)}>
          <div style={{ background: '#0A0D1A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24, width: '100%', maxWidth: 400, padding: 24 }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 16 }}>تعديل الخدمة</h3>
            <form onSubmit={async (e) => {
              e.preventDefault()
              setSavingService(true)
              try {
                const { error } = await supabase
                  .from('services')
                  .update({ name: editingService.name, price: editingService.price })
                  .eq('id', editingService.id)
                if (error) throw error
                setEditingService(null)
                fetchData()
              } catch (err) {
                alert('فشل تحديث الخدمة')
              } finally {
                setSavingService(false)
              }
            }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 12, color: '#9ca3af' }}>اسم الخدمة</label>
                <input type="text" value={editingService.name || ''} onChange={e => setEditingService({...editingService, name: e.target.value})}
                  style={{ background: '#050814', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 12, color: '#fff', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 12, color: '#9ca3af' }}>السعر (ج.م)</label>
                <input type="number" value={editingService.price || 0} onChange={e => setEditingService({...editingService, price: parseFloat(e.target.value)})}
                  style={{ background: '#050814', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 12, color: '#fff', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button type="submit" disabled={savingService}
                  style={{ flex: 1, background: 'linear-gradient(90deg, #FF8A00, #FFB800)', color: '#000', padding: 12, borderRadius: 12, border: 'none', fontWeight: 900, cursor: savingService ? 'not-allowed' : 'pointer', opacity: savingService ? 0.7 : 1 }}>
                  {savingService ? 'جاري الحفظ...' : 'حفظ'}
                </button>
                <button type="button" onClick={() => setEditingService(null)}
                  style={{ flex: 1, background: 'rgba(255,255,255,0.1)', color: '#fff', padding: 12, borderRadius: 12, border: 'none', fontWeight: 700, cursor: 'pointer' }}>إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editUserData && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={() => setEditUserData(null)}>
          <div style={{ background: '#0A0D1A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24, width: '100%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: 24, borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: '#0A0D1A', zIndex: 10 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>تعديل بيانات المستخدم</h2>
              <button onClick={() => setEditUserData(null)} style={{ background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer' }}><XCircle size={24} /></button>
            </div>
            <form onSubmit={saveUserData} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 12, color: '#9ca3af' }}>الاسم الكامل</label>
                  <input type="text" value={editUserData.full_name || ''} onChange={e => setEditUserData({...editUserData, full_name: e.target.value})} style={{ background: '#050814', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 12, color: '#fff', outline: 'none' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 12, color: '#9ca3af' }}>رقم الهاتف</label>
                  <input type="text" value={editUserData.phone || ''} onChange={e => setEditUserData({...editUserData, phone: e.target.value})} style={{ background: '#050814', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 12, color: '#fff', outline: 'none' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 12, color: '#9ca3af' }}>المحافظة</label>
                  <input type="text" value={editUserData.governorate || ''} onChange={e => setEditUserData({...editUserData, governorate: e.target.value})} style={{ background: '#050814', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 12, color: '#fff', outline: 'none' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 12, color: '#9ca3af' }}>المنطقة</label>
                  <input type="text" value={editUserData.area || ''} onChange={e => setEditUserData({...editUserData, area: e.target.value})} style={{ background: '#050814', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 12, color: '#fff', outline: 'none' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 12, color: '#9ca3af' }}>نوع الحساب</label>
                  <select value={editUserData.role || 'client'} onChange={e => setEditUserData({...editUserData, role: e.target.value})} style={{ background: '#050814', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 12, color: '#fff', outline: 'none' }}>
                    <option value="client">عميل</option>
                    <option value="worker">حرفي</option>
                    <option value="admin">أدمن</option>
                  </select>
                </div>
                {editUserData.role === 'worker' && (
                  <>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <label style={{ fontSize: 12, color: '#9ca3af' }}>المهنة</label>
                      <input type="text" value={editUserData.profession || ''} onChange={e => setEditUserData({...editUserData, profession: e.target.value})} style={{ background: '#050814', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 12, color: '#fff', outline: 'none' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <label style={{ fontSize: 12, color: '#9ca3af' }}>المستوى</label>
                      <input type="text" value={editUserData.category_level || ''} onChange={e => setEditUserData({...editUserData, category_level: e.target.value})} style={{ background: '#050814', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 12, color: '#fff', outline: 'none' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <label style={{ fontSize: 12, color: '#9ca3af' }}>الأرباح (ج.م)</label>
                      <input type="number" value={editUserData.total_earnings || 0} onChange={e => setEditUserData({...editUserData, total_earnings: parseFloat(e.target.value)})} style={{ background: '#050814', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 12, color: '#fff', outline: 'none' }} />
                    </div>
                  </>
                )}
              </div>
              <button type="submit" disabled={isEditingUser} style={{ marginTop: 16, background: 'linear-gradient(90deg, #FF8A00, #FFB800)', color: '#000', padding: 16, borderRadius: 12, border: 'none', fontWeight: 900, fontSize: 16, cursor: isEditingUser ? 'not-allowed' : 'pointer', opacity: isEditingUser ? 0.7 : 1 }}>
                {isEditingUser ? 'جاري الحفظ...' : 'حفظ التعديلات'}
              </button>
            </form>
          </div>
        </div>
      )}
      {/* Spin animation */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
