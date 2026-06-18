'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'
import { useRouter } from 'next/navigation'


export default function RegisterPage() {
    const router = useRouter()
    const [fullName, setFullName] = useState('')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = () => {
        if (!fullName || !phone || !password || !confirmPassword) return
        if (password !== confirmPassword) return
        setIsLoading(true)
        setTimeout(() => {
            router.push('/Proffession')
        }, 800)
    }

    const disabled = isLoading || !fullName || !phone || !password || !confirmPassword

    return (
        <div
            dir="rtl"
            className="min-h-screen relative isolate flex flex-col w-full font-arabic bg-bg-dark-solid"
        >
            {/* Background decorative tool SVGs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <svg
                    className="absolute top-[120px] -right-10 opacity-15"
                    width="120" height="120" viewBox="0 0 24 24" fill="none"
                >
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#FF8A00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <svg
                    className="absolute bottom-[200px] -left-8 opacity-10"
                    width="100" height="100" viewBox="0 0 24 24" fill="none"
                >
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" stroke="#FF8A00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <svg
                    className="absolute top-[400px] left-5 opacity-8"
                    width="80" height="80" viewBox="0 0 24 24" fill="none"
                >
                    <path d="M6 9V3M6 3H2M6 3h4M6 21v-6M6 15H2M6 15h4M18 9V3M18 3h-4M18 3h4M18 21v-6M18 15h-4M18 15h4" stroke="#FF8A00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <svg
                    className="absolute bottom-[100px] right-5 opacity-10"
                    width="90" height="90" viewBox="0 0 24 24" fill="none"
                >
                    <circle cx="12" cy="12" r="2.5" stroke="#FF8A00" strokeWidth="1.5" />
                    <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="#FF8A00" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
            </div>

            {/* Content */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative z-10 flex flex-col w-full max-w-[512px] mx-auto min-h-screen px-2xl"
            >
                {/* Header */}
                <div className="flex flex-col items-center w-full pt-[60px] gap-sm">

                   <div className="flex items-center justify-center ">
                            <img
                                src="/hirfa_logo.svg"
                                alt="Hirfa Logo"
                                className="w-[150px] h-[150px] object-contain -mb-[30px]"
                            />
                        </div>

                    <h1 className="text-[26px] font-extrabold leading-9 text-center">
                        انشاء حساب حرفي
                    </h1>

                    <p className="text-[14px] font-normal leading-5 text-center text-slate-400">
                        أدخل بياناتك الأساسية للبدء
                    </p>

                </div>

                {/* Form */}
                <div className="flex flex-col w-full mt-4xl gap-xl">
                    {/* Full Name */}
                    <div className="flex flex-col w-full gap-sm">
                        <label className="text-[13px] font-semibold leading-5 text-text-white">
                            الاسم بالكامل
                        </label>
                        <div className="flex items-center w-full rounded-input h-[52px] px-lg border border-white/8 bg-white/4">
                            <input
                                type="text"
                                placeholder="محمد أحمد السعدني"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full bg-transparent text-text-white text-[14px] font-normal outline-none"
                            />
                        </div>
                    </div>

                    {/* Phone */}
                    <div className="flex flex-col w-full gap-sm">
                        <label className="text-[13px] font-semibold leading-5 text-text-white">
                            رقم الهاتف
                        </label>
                        <div className="flex items-center w-full rounded-input h-[52px] px-lg border border-white/8 bg-white/4">
                            <div className="flex items-center shrink-0 gap-[6px] pe-3 border-s border-white/8">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <rect x="2" y="3" width="20" height="14" rx="2" stroke="#94A3B8" strokeWidth="1.5" />
                                    <path d="M2 7h20" stroke="#94A3B8" strokeWidth="1.5" />
                                    <circle cx="12" cy="11" r="2.5" stroke="#94A3B8" strokeWidth="1.5" />
                                </svg>
                                <span className="text-[13px] font-medium text-slate-400">+20</span>
                            </div>
                            <input
                                type="tel"
                                placeholder="010 0000 0000"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full bg-transparent text-text-white text-[14px] font-normal outline-none pr-3 [direction:ltr]"
                            />
                        </div>
                    </div>

                    {/* Email (Optional) */}
                    <div className="flex flex-col w-full gap-sm">
                        <label className="text-[13px] font-semibold leading-5 text-text-white">
                            البريد الإلكتروني
                            <span className="text-[11px] font-normal me-1 text-slate-400">(اختياري)</span>
                        </label>
                        <div className="flex items-center w-full rounded-input h-[52px] px-lg border border-white/8 bg-white/4">
                            <input
                                type="email"
                                placeholder="example@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-transparent text-text-white text-[14px] font-normal outline-none"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="flex flex-col w-full gap-sm">
                        <label className="text-[13px] font-semibold leading-5 text-text-white">
                            كلمة المرور
                        </label>
                        <div className="flex items-center w-full rounded-input h-[52px] px-lg border border-white/8 bg-white/4">
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="shrink-0 flex items-center justify-center bg-transparent border-none cursor-pointer text-slate-400"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-transparent text-text-white text-[14px] font-normal outline-none pe-3"
                            />
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="flex flex-col w-full gap-sm">
                        <label className="text-[13px] font-semibold leading-5 text-text-white">
                            تأكيد كلمة المرور
                        </label>
                        <div className="flex items-center w-full rounded-input h-[52px] px-lg border border-white/8 bg-white/4">
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="shrink-0 flex items-center justify-center bg-transparent border-none cursor-pointer text-slate-400"
                            >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full bg-transparent text-text-white text-[14px] font-normal outline-none pe-3"
                            />
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    onClick={handleSubmit}
                    disabled={disabled}
                    className="w-full rounded-[12px] text-center text-[16px] font-normal leading-6 text-white mt-3xl px-6 py-4 h-14 bg-[var(--gradient-primary-horizontal)] shadow-[0_10px_15px_-3px_rgba(255,138,0,0.20),0_4px_6px_-4px_rgba(255,138,0,0.20)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer border-none"
                >
                    {isLoading ? 'جاري...' : 'التالي'}
                </button>

                {/* Divider */}
                <div className="flex items-center w-full mt-[28px] gap-lg">
                    <div className="flex-1 h-px bg-white/8" />
                    <span className="text-[13px] font-medium shrink-0 text-slate-400">أو</span>
                    <div className="flex-1 h-px bg-white/8" />
                </div>

                {/* Google Sign In */}
                <button
                    className="w-full rounded-[12px] flex items-center justify-center mt-xl px-6 py-4 h-14 gap-md bg-[linear-gradient(90deg,rgba(196,198,207,0.30)_0%,#44474E_100%)] cursor-pointer border-none text-white text-[16px] font-normal leading-6"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    <span>المتابعة مع Google</span>
                </button>

                {/* Footer */}
                <div className="flex items-center justify-center w-full mt-3xl mb-4xl gap-xs">
                    <span className="text-[13px] font-normal text-slate-400">لديك حساب بالفعل؟</span>
                    <button
                        onClick={() => router.push('/login')}
                        className="text-[13px] font-bold text-primary bg-transparent border-none cursor-pointer"
                    >
                        تسجيل الدخول
                    </button>
                </div>
            </motion.div>
        </div>
    )
}
