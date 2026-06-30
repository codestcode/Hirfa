-- ════════════════════════════════════════════
-- HIRFA — Migration: add missing tables & columns
-- Safe to run multiple times (idempotent)
-- ════════════════════════════════════════════

-- ============================================
-- 1. Add missing columns to BOOKINGS
-- ============================================
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'cash';
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS is_emergency BOOLEAN DEFAULT false;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS emergency_type TEXT;

-- ============================================
-- 2. WORKER GALLERY TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.worker_gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  image_url TEXT,
  before_url TEXT,
  after_url TEXT,
  title TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.worker_gallery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read worker gallery"
  ON public.worker_gallery FOR SELECT
  USING (true);

CREATE POLICY "Workers can manage own gallery"
  ON public.worker_gallery FOR ALL
  USING (auth.uid() = worker_id);

-- ============================================
-- 3. NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT,
  body TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (true);

-- ============================================
-- 4. CONVERSATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  last_message TEXT,
  last_message_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants can read conversations"
  ON public.conversations FOR SELECT
  USING (auth.uid() = worker_id OR auth.uid() = client_id);

-- ============================================
-- 5. WALLET BALANCE on PROFILES
-- ============================================
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS wallet_balance NUMERIC DEFAULT 0;

-- ============================================
-- 6. TRANSACTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('deposit', 'payment', 'refund')),
  amount NUMERIC NOT NULL,
  description TEXT,
  reference_type TEXT,
  reference_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own transactions"
  ON public.transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions"
  ON public.transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 7. SAVED CARDS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.saved_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  last_four TEXT NOT NULL,
  card_holder TEXT NOT NULL,
  brand TEXT NOT NULL DEFAULT 'visa',
  expiry_date TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.saved_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own saved cards"
  ON public.saved_cards FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own saved cards"
  ON public.saved_cards FOR ALL
  USING (auth.uid() = user_id);

-- ============================================
-- 8. REVIEWS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  craftsman_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read reviews"
  ON public.reviews FOR SELECT
  USING (true);

CREATE POLICY "Clients can insert own reviews"
  ON public.reviews FOR INSERT
  WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Admins can delete reviews"
  ON public.reviews FOR DELETE
  USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'));

-- ============================================
-- 9. ADDRESSES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'home' CHECK (type IN ('home', 'work', 'other')),
  label TEXT,
  city TEXT NOT NULL,
  street TEXT NOT NULL,
  building TEXT,
  apartment TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own addresses"
  ON public.addresses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own addresses"
  ON public.addresses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own addresses"
  ON public.addresses FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own addresses"
  ON public.addresses FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- 10. WORKER SCHEDULE TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.worker_schedule (
  worker_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  day_id TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  start_time TIME NOT NULL DEFAULT '09:00:00',
  end_time TIME NOT NULL DEFAULT '17:00:00',
  PRIMARY KEY (worker_id, day_id)
);

ALTER TABLE public.worker_schedule ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read worker schedule"
  ON public.worker_schedule FOR SELECT
  USING (true);

CREATE POLICY "Workers can manage own schedule"
  ON public.worker_schedule FOR ALL
  USING (auth.uid() = worker_id);

-- ============================================
-- 11. UPDATE TRANSACTIONS CHECK CONSTRAINT
-- ============================================
ALTER TABLE public.transactions DROP CONSTRAINT IF EXISTS transactions_type_check;
ALTER TABLE public.transactions ADD CONSTRAINT transactions_type_check CHECK (type IN ('deposit', 'payment', 'refund', 'withdrawal'));

-- ============================================
-- 12. PASSWORD RESET OTPS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.password_reset_otps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  otp TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.password_reset_otps ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 13. ADDITIONAL COLUMNS FOR PROFILES
-- ============================================
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'unverified';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS rejection_reason TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS selfie_url TEXT;

-- ============================================
-- 14. ADDITIONAL COLUMNS FOR BOOKINGS (TRACKING)
-- ============================================
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS tracking_status TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS eta TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS craftsman_lat NUMERIC;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS craftsman_lng NUMERIC;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS status_notes TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS work_progress TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS status_history JSONB DEFAULT '[]'::jsonb;

-- ============================================
-- 15. WITHDRAWAL METHODS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.withdrawal_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('vodafone_cash', 'bank_account')),
  account_number TEXT NOT NULL,
  bank_name TEXT,
  holder_name TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.withdrawal_methods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read withdrawal methods"
  ON public.withdrawal_methods FOR SELECT
  USING (true);

CREATE POLICY "Users can manage own withdrawal methods"
  ON public.withdrawal_methods FOR ALL
  USING (auth.uid() = worker_id);

-- ============================================
-- 16. ADDITIONAL COLUMNS FOR SERVICES (CATALOG)
-- ============================================
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS price_range TEXT;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS duration TEXT;

-- ============================================
-- 17. EMERGENCIES TABLE POLICIES
-- ============================================
ALTER TABLE public.emergencies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read emergencies"
  ON public.emergencies FOR SELECT
  USING (true);

CREATE POLICY "Users can insert emergencies"
  ON public.emergencies FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Workers can update emergencies"
  ON public.emergencies FOR UPDATE
  USING (true);

CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.admin_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.admin_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all admin_messages" ON public.admin_messages;
CREATE POLICY "Allow all admin_messages" ON public.admin_messages FOR ALL USING (true);
