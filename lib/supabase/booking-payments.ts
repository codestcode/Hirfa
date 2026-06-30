import { SupabaseClient } from '@supabase/supabase-js'

export async function processBookingCompletion(supabase: SupabaseClient, bookingId: string) {
  const { data: booking, error: fetchErr } = await supabase
    .from('bookings')
    .select('id, worker_id, client_id, price, payment_method')
    .eq('id', bookingId)
    .single()
  
  if (fetchErr || !booking) {
    throw new Error('لم يتم العثور على الطلب')
  }

  const price = booking.price || 0
  const fee = price * 0.15
  const workerEarnings = price - fee

  const { data: workerProfile, error: workerErr } = await supabase
    .from('profiles')
    .select('wallet_balance, total_earnings, completed_orders')
    .eq('id', booking.worker_id)
    .single()
  
  if (workerErr || !workerProfile) {
    throw new Error('لم يتم العثور على حساب الحرفي')
  }

  const currentBalance = workerProfile.wallet_balance || 0
  const currentTotalEarnings = workerProfile.total_earnings || 0
  const currentCompletedOrders = workerProfile.completed_orders || 0

  if (booking.payment_method === 'cash') {
    const newBalance = currentBalance - fee
    
    await supabase
      .from('profiles')
      .update({
        wallet_balance: newBalance,
        completed_orders: currentCompletedOrders + 1
      })
      .eq('id', booking.worker_id)
    
    await supabase.from('transactions').insert({
      user_id: booking.worker_id,
      type: 'payment',
      amount: -fee,
      description: `خصم عمولة المنصة (15%) للطلب #${booking.id}`
    })
  } else {
    const newBalance = currentBalance + workerEarnings
    const newTotalEarnings = currentTotalEarnings + workerEarnings
    
    await supabase
      .from('profiles')
      .update({
        wallet_balance: newBalance,
        total_earnings: newTotalEarnings,
        completed_orders: currentCompletedOrders + 1
      })
      .eq('id', booking.worker_id)
    
    await supabase.from('transactions').insert({
      user_id: booking.worker_id,
      type: 'deposit',
      amount: workerEarnings,
      description: `أرباح الطلب #${booking.id}`
    })
  }
}
