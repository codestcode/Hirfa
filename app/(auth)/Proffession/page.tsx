'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useRouter } from 'next/navigation'

const professions = [
    { value: '', label: 'اختر المهنة' },
    { value: 'plumbing', label: 'سباك' },
    { value: 'electrical', label: 'كهربائي' },
    { value: 'carpentry', label: 'نجار' },
    { value: 'painting', label: 'دهان' },
    { value: 'ac', label: 'تكييف وتبريد' },
    { value: 'welding', label: 'حداد' },
    { value: 'tiling', label: 'بلاط' },
    { value: 'cleaning', label: 'عامل نظافة' },
    { value: 'other', label: 'أخرى' },
]

const governorates = [
    { value: '', label: 'اختر المحافظة' },
    { value: 'cairo', label: 'القاهرة' },
    { value: 'giza', label: 'الجيزة' },
    { value: 'alexandria', label: 'الإسكندرية' },
    { value: 'sharqia', label: 'الشرقية' },
    { value: 'dakahlia', label: 'الدقهلية' },
    { value: 'beheira', label: 'البحيرة' },
    { value: 'minya', label: 'المنيا' },
    { value: 'aswan', label: 'أسوان' },
]

const areas: Record<string, { value: string; label: string }[]> = {
    cairo: [
        { value: '', label: 'اختر المنطقة' },
        { value: 'nasr-city', label: 'مدينة نصر' },
        { value: 'maadi', label: 'المعادي' },
        { value: 'helwan', label: 'حلوان' },
        { value: 'zamalek', label: 'الزمالك' },
        { value: 'downtown', label: 'وسط البلد' },
        { value: 'new-cairo', label: 'التجمع الخامس' },
        { value: 'rehab', label: 'الرحاب' },
    ],
    giza: [
        { value: '', label: 'اختر المنطقة' },
        { value: 'dokki', label: 'الدقي' },
        { value: 'mohandeseen', label: 'المهندسين' },
        { value: 'haram', label: 'الهرم' },
        { value: '6-october', label: '6 أكتوبر' },
        { value: 'sheikh-zayed', label: 'الشيخ زايد' },
    ],
    alexandria: [
        { value: '', label: 'اختر المنطقة' },
        { value: 'sidi-gaber', label: 'سيدي جابر' },
        { value: 'stanley', label: 'ستانلي' },
        { value: 'smouha', label: 'سموحة' },
        { value: 'miami', label: 'ميامي' },
    ],
}

export default function ProfessionPage() {
    const router = useRouter()
    const [profession, setProfession] = useState('')
    const [experience, setExperience] = useState('')
    const [governorate, setGovernorate] = useState('')
    const [area, setArea] = useState('')
    const [showProfessionDropdown, setShowProfessionDropdown] = useState(false)
    const [showGovDropdown, setShowGovDropdown] = useState(false)
    const [showAreaDropdown, setShowAreaDropdown] = useState(false)

    const isFormValid = profession && experience && governorate && area

    const handleNext = () => {
        if (!isFormValid) return
        router.push('/Verification')
    }

    const handleBack = () => {
        router.push('/register')
    }

    return (
        <div
            dir="rtl"
            className="min-h-screen relative isolate flex flex-col w-full font-arabic"
            style={{ background: '#000419' }}
        >
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative z-10 flex flex-col w-full max-w-[512px] mx-auto"
                style={{ minHeight: '100vh', padding: '0 24px' }}
            >
                {/* Header */}
                <div
                    className="flex flex-col items-center w-full"
                    style={{ paddingTop: '60px', gap: '8px' }}
                >
                      <div className="flex items-center justify-center ">
                        <img
                            src="/hirfa_logo.svg"
                            alt="Hirfa Logo"
                            className="w-[150px] h-[150px] object-contain -mb-[30px]"
                        />
                    </div>

                    <h1
                        className="text-[26px] font-extrabold leading-9 text-center text-white"
                        style={{ marginTop: '16px', letterSpacing: '-0.5px' }}
                    >
                        بيانات المهنة
                    </h1>

                    <p
                        className="text-[14px] font-normal leading-5 text-center"
                        style={{ color: '#94A3B8' }}
                    >
                        بيانات العمل و التخصص
                    </p>
                </div>

                {/* Form */}
                <div className="flex flex-col w-full" style={{ marginTop: '40px', gap: '20px' }}>
                    {/* Profession Dropdown */}
                    <div className="flex flex-col w-full" style={{ gap: '8px' }}>
                        <label className="text-[13px] font-semibold leading-5 text-white">المهنة</label>
                        <div className="relative">
                            <button
                                onClick={() => setShowProfessionDropdown(!showProfessionDropdown)}
                                className="flex items-center justify-between w-full rounded-[16px] text-right"
                                style={{
                                    padding: '0 16px',
                                    height: '52px',
                                    border: '1px solid rgba(255, 255, 255, 0.08)',
                                    background: 'rgba(255, 255, 255, 0.04)',
                                    cursor: 'pointer',
                                    color: profession ? '#FFFFFF' : '#94A3B8',
                                }}
                            >
                                <ChevronDown size={18} style={{ color: '#94A3B8' }} />
                                <span className="text-[14px] font-normal">
                                    {professions.find(p => p.value === profession)?.label || 'اختر المهنة'}
                                </span>
                            </button>
                            {showProfessionDropdown && (
                                <div
                                    className="absolute w-full z-20 rounded-[16px] overflow-hidden"
                                    style={{
                                        marginTop: '4px',
                                        border: '1px solid rgba(255, 255, 255, 0.08)',
                                        background: '#0F172A',
                                        boxShadow: '0 20px 60px 0 rgba(0, 0, 0, 0.50)',
                                    }}
                                >
                                    {professions.map((p) => (
                                        <button
                                            key={p.value}
                                            onClick={() => {
                                                setProfession(p.value)
                                                setShowProfessionDropdown(false)
                                            }}
                                            className="w-full text-right px-4 py-3 text-[14px] transition-colors"
                                            style={{
                                                color: p.value === profession ? '#FF8A00' : '#94A3B8',
                                                background: p.value === profession ? 'rgba(255, 138, 0, 0.08)' : 'transparent',
                                            }}
                                            onMouseEnter={(e) => { if (p.value !== profession) e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}
                                            onMouseLeave={(e) => { if (p.value !== profession) e.currentTarget.style.background = 'transparent' }}
                                        >
                                            {p.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Years of Experience */}
                    <div className="flex flex-col w-full" style={{ gap: '8px' }}>
                        <label className="text-[13px] font-semibold leading-5 text-white">سنوات الخبرة</label>
                        <div
                            className="flex items-center w-full rounded-[16px]"
                            style={{
                                padding: '0 16px',
                                height: '52px',
                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                background: 'rgba(255, 255, 255, 0.04)',
                            }}
                        >
                            <input
                                type="number"
                                placeholder="مثال: 5"
                                min="0"
                                max="50"
                                value={experience}
                                onChange={(e) => setExperience(e.target.value)}
                                className="w-full bg-transparent text-white text-[14px] font-normal outline-none"
                                style={{ direction: 'rtl' }}
                            />
                        </div>
                    </div>

                    {/* Governorate Dropdown */}
                    <div className="flex flex-col w-full" style={{ gap: '8px' }}>
                        <label className="text-[13px] font-semibold leading-5 text-white">المحافظة</label>
                        <div className="relative">
                            <button
                                onClick={() => setShowGovDropdown(!showGovDropdown)}
                                className="flex items-center justify-between w-full rounded-[16px] text-right"
                                style={{
                                    padding: '0 16px',
                                    height: '52px',
                                    border: '1px solid rgba(255, 255, 255, 0.08)',
                                    background: 'rgba(255, 255, 255, 0.04)',
                                    cursor: 'pointer',
                                    color: governorate ? '#FFFFFF' : '#94A3B8',
                                }}
                            >
                                <ChevronDown size={18} style={{ color: '#94A3B8' }} />
                                <span className="text-[14px] font-normal">
                                    {governorates.find(g => g.value === governorate)?.label || 'اختر المحافظة'}
                                </span>
                            </button>
                            {showGovDropdown && (
                                <div
                                    className="absolute w-full z-20 rounded-[16px] overflow-hidden"
                                    style={{
                                        marginTop: '4px',
                                        border: '1px solid rgba(255, 255, 255, 0.08)',
                                        background: '#0F172A',
                                        boxShadow: '0 20px 60px 0 rgba(0, 0, 0, 0.50)',
                                    }}
                                >
                                    {governorates.map((g) => (
                                        <button
                                            key={g.value}
                                            onClick={() => {
                                                setGovernorate(g.value)
                                                setArea('')
                                                setShowGovDropdown(false)
                                            }}
                                            className="w-full text-right px-4 py-3 text-[14px] transition-colors"
                                            style={{
                                                color: g.value === governorate ? '#FF8A00' : '#94A3B8',
                                                background: g.value === governorate ? 'rgba(255, 138, 0, 0.08)' : 'transparent',
                                            }}
                                            onMouseEnter={(e) => { if (g.value !== governorate) e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}
                                            onMouseLeave={(e) => { if (g.value !== governorate) e.currentTarget.style.background = 'transparent' }}
                                        >
                                            {g.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Area Dropdown */}
                    <div className="flex flex-col w-full" style={{ gap: '8px' }}>
                        <label className="text-[13px] font-semibold leading-5 text-white">المنطقة</label>
                        <div className="relative">
                            <button
                                onClick={() => {
                                    if (governorate) setShowAreaDropdown(!showAreaDropdown)
                                }}
                                className="flex items-center justify-between w-full rounded-[16px] text-right"
                                style={{
                                    padding: '0 16px',
                                    height: '52px',
                                    border: '1px solid rgba(255, 255, 255, 0.08)',
                                    background: 'rgba(255, 255, 255, 0.04)',
                                    cursor: governorate ? 'pointer' : 'not-allowed',
                                    color: area ? '#FFFFFF' : '#94A3B8',
                                    opacity: governorate ? 1 : 0.5,
                                }}
                            >
                                <ChevronDown size={18} style={{ color: '#94A3B8' }} />
                                <span className="text-[14px] font-normal">
                                    {area
                                        ? (areas[governorate] || []).find(a => a.value === area)?.label
                                        : governorate
                                            ? 'اختر المنطقة'
                                            : 'اختر المحافظة أولاً'}
                                </span>
                            </button>
                            {showAreaDropdown && governorate && (
                                <div
                                    className="absolute w-full z-20 rounded-[16px] overflow-hidden"
                                    style={{
                                        marginTop: '4px',
                                        border: '1px solid rgba(255, 255, 255, 0.08)',
                                        background: '#0F172A',
                                        boxShadow: '0 20px 60px 0 rgba(0, 0, 0, 0.50)',
                                    }}
                                >
                                    {(areas[governorate] || []).map((a) => (
                                        <button
                                            key={a.value}
                                            onClick={() => {
                                                setArea(a.value)
                                                setShowAreaDropdown(false)
                                            }}
                                            className="w-full text-right px-4 py-3 text-[14px] transition-colors"
                                            style={{
                                                color: a.value === area ? '#FF8A00' : '#94A3B8',
                                                background: a.value === area ? 'rgba(255, 138, 0, 0.08)' : 'transparent',
                                            }}
                                            onMouseEnter={(e) => { if (a.value !== area) e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}
                                            onMouseLeave={(e) => { if (a.value !== area) e.currentTarget.style.background = 'transparent' }}
                                        >
                                            {a.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center w-full" style={{ marginTop: '40px', gap: '12px' }}>
                    <button
                        onClick={handleBack}
                        className="flex-1 rounded-[12px] text-center text-[16px] font-normal leading-6 text-white px-6 py-4 h-14 bg-[linear-gradient(90deg,rgba(196,198,207,0.30)_0%,#44474E_100%)] cursor-pointer border-none"
                    >
                        السابق
                    </button>

                    <button
                        onClick={handleNext}
                        disabled={!isFormValid}
                        className="flex-1 rounded-[12px] text-center text-[16px] font-normal leading-6 text-white px-6 py-4 h-14 bg-[var(--gradient-primary-horizontal)] shadow-[0_10px_15px_-3px_rgba(255,138,0,0.20),0_4px_6px_-4px_rgba(255,138,0,0.20)] border-none"
                        style={{ opacity: isFormValid ? 1 : 0.5, cursor: isFormValid ? 'pointer' : 'not-allowed' }}
                    >
                        التالي
                    </button>
                </div>

                {/* Bottom spacer */}
                <div style={{ height: '40px' }} />
            </motion.div>
        </div>
    )
}
