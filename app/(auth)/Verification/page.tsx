'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Upload, Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const uploadItems = [
    { id: 'profile', label: 'رفع صورة شخصية' },
    { id: 'id-front', label: 'رفع صورة بطاقة الهوية (الوجه الأمامي)' },
    { id: 'id-back', label: 'رفع صورة بطاقة الهوية (الوجه الخلفي)' },
    { id: 'portfolio', label: 'رفع صور أعمال سابقة' },
]

export default function VerificationPage() {
    const router = useRouter()
    const [uploads, setUploads] = useState<Record<string, File | null>>({})
    const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const uploadedCount = Object.values(uploads).filter(Boolean).length
    const allUploaded = uploadedCount === uploadItems.length

    const handleFileChange = (id: string, file: File | null) => {
        setUploads((prev) => ({ ...prev, [id]: file }))
    }

    const handleNext = async () => {
        if (!allUploaded || isLoading) return
        setIsLoading(true)
        setError('')
        const supabase = createClient()
        try {
            const { data: { user }, error: userError } = await supabase.auth.getUser()
            if (userError || !user) {
                throw new Error('لم يتم العثور على الحساب. يرجى تسجيل الدخول.')
            }

            const urls: Record<string, string> = {}

            for (const item of uploadItems) {
                const file = uploads[item.id]
                if (file) {
                    const fileExt = file.name.split('.').pop()
                    const filePath = `${user.id}/${item.id}_${Date.now()}.${fileExt}`
                    
                    const { error: uploadError } = await supabase.storage
                        .from('verification')
                        .upload(filePath, file)
                    
                    if (uploadError) {
                        urls[item.id] = URL.createObjectURL(file)
                    } else {
                        const { data: { publicUrl } } = supabase.storage
                            .from('verification')
                            .getPublicUrl(filePath)
                        urls[item.id] = publicUrl
                    }
                }
            }

            const { error: updateError } = await supabase
                .from('profiles')
                .update({
                    selfie_url: urls['profile'] || null,
                    avatar_url: urls['profile'] || null,
                    id_front_url: urls['id-front'] || null,
                    id_back_url: urls['id-back'] || null,
                    verification_status: 'pending',
                    verified: false,
                    rejection_reason: null
                })
                .eq('id', user.id)

            if (updateError) throw updateError

            if (urls['portfolio']) {
                await supabase.from('worker_gallery').insert({
                    worker_id: user.id,
                    image_url: urls['portfolio'],
                    title: 'عمل سابق'
                })
            }

            router.push('/worker/home')
        } catch (err: any) {
            setError(err.message || 'حدث خطأ أثناء رفع المستندات.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleBack = () => {
        router.push('/worker/home')
    }

    return (
        <div
            dir="rtl"
            className="min-h-screen relative isolate flex flex-col w-full font-arabic bg-bg-dark-solid"
        >
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative z-10 flex flex-col w-full max-w-[512px] mx-auto min-h-screen px-2xl"
            >
                {/* Header */}
                <div className="flex flex-col items-center w-full pt-[60px] gap-sm">
                    <div className="flex items-center justify-center rounded-full ">
                        <div className="flex items-center justify-center ">
                            <img
                                src="/hirfa_logo.svg"
                                alt="Hirfa Logo"
                                className="w-[150px] h-[150px] object-contain -mb-[30px]"
                            />
                        </div>

                    </div>

                    <h1 className="text-[26px] font-extrabold leading-9 text-center text-text-white mt-lg tracking-[-0.5px]">
                        توثيق الحساب
                    </h1>

                    <p className="text-[14px] font-normal leading-5 text-center text-slate-400">
                        قم برفع المستندات المطلوبة لتوثيق حسابك
                    </p>
                </div>

                {/* Upload Progress Indicator */}
                <div className="flex items-center w-full mt-[28px] gap-sm">
                    <div className="flex-1 flex items-center gap-xs">
                        {uploadItems.map((item) => (
                            <div
                                key={item.id}
                                className={`flex-1 h-1 rounded-full ${uploads[item.id]
                                        ? 'bg-gradient-primary-horizontal'
                                        : 'bg-white/8'
                                    }`}
                            />
                        ))}
                    </div>
                    <span className="text-label font-medium shrink-0 text-slate-400">
                        {uploadedCount}/{uploadItems.length}
                    </span>
                </div>

                {/* Upload Sections */}
                <div className="flex flex-col w-full mt-2xl gap-lg">
                    {uploadItems.map((item) => {
                        const uploaded = uploads[item.id]
                        return (
                            <div
                                key={item.id}
                                className={`flex items-center w-full rounded-xl relative overflow-hidden px-xl py-lg gap-lg cursor-pointer transition-all duration-200 ${uploaded
                                        ? 'border-[1.5px] border-[rgba(34,197,94,0.30)] bg-[rgba(34,197,94,0.05)]'
                                        : 'border-[1.5px] dashed border-white/12 bg-white/3 hover:border-primary/30 hover:bg-primary/5'
                                    }`}
                                onClick={() => fileInputRefs.current[item.id]?.click()}
                            >
                                <input
                                    ref={(el) => { fileInputRefs.current[item.id] = el }}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => handleFileChange(item.id, e.target.files?.[0] || null)}
                                />

                                <div className={`flex items-center justify-center rounded-md shrink-0 w-12 h-12 ${uploaded ? 'bg-[rgba(34,197,94,0.10)]' : 'bg-primary/8'
                                    }`}>
                                    {uploaded
                                        ? <Check size={22} className="text-[#22C55E]" />
                                        : <Upload size={20} className="text-primary" />
                                    }
                                </div>

                                <div className="flex flex-col items-start gap-[2px]">
                                    <span className="text-[14px] font-semibold leading-5 text-text-white">
                                        {item.label}
                                    </span>
                                    <span className="text-[11px] font-normal leading-4 text-slate-400">
                                        {uploaded
                                            ? uploaded.name.length > 30
                                                ? uploaded.name.slice(0, 30) + '...'
                                                : uploaded.name
                                            : 'اضغط لرفع صورة'}
                                    </span>
                                </div>

                                {uploaded && (
                                    <div className="flex-1 flex justify-start">
                                        <div className="rounded-sm px-[10px] py-[2px] bg-[rgba(34,197,94,0.10)] border border-[rgba(34,197,94,0.20)]">
                                            <span className="text-[10px] font-semibold text-[#4ADE80]">تم الرفع</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center w-full mt-[36px] gap-md">
                    <button
                        onClick={handleBack}
                        className="flex-1 rounded-[12px] text-center text-[16px] font-normal leading-6 text-white px-6 py-4 h-14 bg-[linear-gradient(90deg,rgba(196,198,207,0.30)_0%,#44474E_100%)] cursor-pointer border-none"
                    >
                        السابق
                    </button>

                    <button
                        onClick={handleNext}
                        disabled={!allUploaded || isLoading}
                        className={`flex-1 rounded-[12px] text-center text-[16px] font-normal leading-6 px-6 py-4 h-14 border-none ${(allUploaded && !isLoading)
                                ? 'bg-[var(--gradient-primary-horizontal)] shadow-[0_10px_15px_-3px_rgba(255,138,0,0.20),0_4px_6px_-4px_rgba(255,138,0,0.20)] text-white cursor-pointer'
                                : 'bg-[linear-gradient(90deg,rgba(196,198,207,0.30)_0%,#44474E_100%)] text-white/50 cursor-not-allowed'
                            }`}
                    >
                        {isLoading ? 'جاري الرفع...' : allUploaded ? 'التالي' : `رفع ${uploadItems.length - uploadedCount} مستندات متبقية`}
                    </button>
                </div>

                {error && (
                    <p className="text-xs text-[#FF4D4D] text-center mt-4 font-semibold">{error}</p>
                )}

                {/* Bottom spacer */}
                <div className="h-4xl" />
            </motion.div>
        </div>
    )
}
