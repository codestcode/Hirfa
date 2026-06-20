import { WorkerRoute } from '@/components/auth/WorkerRoute'
import type { ReactNode } from 'react'

export default function WorkerLayout({ children }: { children: ReactNode }) {
  return <WorkerRoute>{children}</WorkerRoute>
}
