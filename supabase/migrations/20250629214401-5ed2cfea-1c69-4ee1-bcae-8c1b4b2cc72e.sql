
-- First, let's check which policies already exist and only create missing ones
-- Drop and recreate policies to ensure they're properly configured

-- Drop existing policies if they exist (this won't error if they don't exist)
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

DROP POLICY IF EXISTS "Users can view own care recipients" ON public.care_recipients;
DROP POLICY IF EXISTS "Users can insert own care recipients" ON public.care_recipients;
DROP POLICY IF EXISTS "Users can update own care recipients" ON public.care_recipients;
DROP POLICY IF EXISTS "Users can delete own care recipients" ON public.care_recipients;

DROP POLICY IF EXISTS "Users can view own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can create own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can update own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can delete own bookings" ON public.bookings;

DROP POLICY IF EXISTS "Users can view own payments" ON public.payments;
DROP POLICY IF EXISTS "Users can create own payments" ON public.payments;

DROP POLICY IF EXISTS "Users can view own addresses" ON public.addresses;
DROP POLICY IF EXISTS "Users can create own addresses" ON public.addresses;
DROP POLICY IF EXISTS "Users can update own addresses" ON public.addresses;
DROP POLICY IF EXISTS "Users can delete own addresses" ON public.addresses;

DROP POLICY IF EXISTS "Authenticated users can view caregivers" ON public.caregivers;
DROP POLICY IF EXISTS "Public can view services" ON public.services;
DROP POLICY IF EXISTS "Anyone can join waitlist" ON public.waitlist;

-- Now create all policies fresh
-- Profiles: Users can only access their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Care recipients: Users can only access their own family members
CREATE POLICY "Users can view own care recipients" ON public.care_recipients
  FOR SELECT USING (auth.uid() = profile_id);

CREATE POLICY "Users can insert own care recipients" ON public.care_recipients
  FOR INSERT WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can update own care recipients" ON public.care_recipients
  FOR UPDATE USING (auth.uid() = profile_id);

CREATE POLICY "Users can delete own care recipients" ON public.care_recipients
  FOR DELETE USING (auth.uid() = profile_id);

-- Bookings: Users can only see their own bookings
CREATE POLICY "Users can view own bookings" ON public.bookings
  FOR SELECT USING (auth.uid() = profile_id);

CREATE POLICY "Users can create own bookings" ON public.bookings
  FOR INSERT WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can update own bookings" ON public.bookings
  FOR UPDATE USING (auth.uid() = profile_id);

CREATE POLICY "Users can delete own bookings" ON public.bookings
  FOR DELETE USING (auth.uid() = profile_id);

-- Payments: Users can only access their own payment records
CREATE POLICY "Users can view own payments" ON public.payments
  FOR SELECT USING (auth.uid() = profile_id);

CREATE POLICY "Users can create own payments" ON public.payments
  FOR INSERT WITH CHECK (auth.uid() = profile_id);

-- Addresses: Users can only manage their own addresses
CREATE POLICY "Users can view own addresses" ON public.addresses
  FOR SELECT USING (auth.uid() = profile_id);

CREATE POLICY "Users can create own addresses" ON public.addresses
  FOR INSERT WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can update own addresses" ON public.addresses
  FOR UPDATE USING (auth.uid() = profile_id);

CREATE POLICY "Users can delete own addresses" ON public.addresses
  FOR DELETE USING (auth.uid() = profile_id);

-- Caregivers: Read-only access for all authenticated users (for matching)
CREATE POLICY "Authenticated users can view caregivers" ON public.caregivers
  FOR SELECT TO authenticated USING (true);

-- Services: Public read access for service information
CREATE POLICY "Public can view services" ON public.services
  FOR SELECT USING (true);

-- Waitlist: Allow public inserts for new signups
CREATE POLICY "Anyone can join waitlist" ON public.waitlist
  FOR INSERT WITH CHECK (true);
