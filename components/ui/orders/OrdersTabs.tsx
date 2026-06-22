export type TabType = 'pending' | 'confirmed' | 'completed'

export function OrdersTabs({ activeTab: a, onTabChange: oC }: { activeTab: TabType, onTabChange: (t: TabType) => void }) {
  const tabs = [{ id: 'pending', l: 'جديدة' }, { id: 'confirmed', l: 'قيد التنفيذ' }, { id: 'completed', l: 'مكتملة' }]
  return (
    <div className="flex bg-[#0A0D1A] rounded-xl p-1 mb-6 border border-white/5">
      {tabs.map(t => <button key={t.id} onClick={() => oC(t.id as TabType)} className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-colors ${a === t.id ? 'bg-[#FF8A00] text-white shadow-[0_4px_12px_rgba(255,138,0,0.3)]' : 'text-[#6B7A99] hover:text-white'}`}>{t.l}</button>)}
    </div>
  )
}
