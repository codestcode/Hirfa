'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function CraftsmanPage({ params }: { params: { id: string } }) {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background pb-32 flex flex-col items-center justify-center">
      <div className="absolute top-4 right-4">
        <Button onClick={() => router.back()} variant="ghost" size="icon">
          <ArrowLeft className="w-5 h-5" />
        </Button>
      </div>
      <h1 className="text-xl font-bold font-cairo">الصفحة قيد التطوير</h1>
      <p className="text-muted-foreground font-cairo mt-2">جاري ربط بيانات الحرفي بقاعدة البيانات...</p>
    </div>
  )
}
