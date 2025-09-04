
-- First, let's create RLS policies for all tables that contain user data

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can only access their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Enable RLS on care_recipients table
ALTER TABLE public.care_recipients ENABLE ROW LEVEL SECURITY;

-- Care recipients: Users can only access their own family members
CREATE POLICY "Users can view own care recipients" ON public.care_recipients
  FOR SELECT USING (auth.uid() = profile_id);

CREATE POLICY "Users can insert own care recipients" ON public.care_recipients
  FOR INSERT WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can update own care recipients" ON public.care_recipients
  FOR UPDATE USING (auth.uid() = profile_id);

CREATE POLICY "Users can delete own care recipients" ON public.care_recipients
  FOR DELETE USING (auth.uid() = profile_id);

-- Enable RLS on bookings table
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Bookings: Users can only see their own bookings
CREATE POLICY "Users can view own bookings" ON public.bookings
  FOR SELECT USING (auth.uid() = profile_id);

CREATE POLICY "Users can create own bookings" ON public.bookings
  FOR INSERT WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can update own bookings" ON public.bookings
  FOR UPDATE USING (auth.uid() = profile_id);

CREATE POLICY "Users can delete own bookings" ON public.bookings
  FOR DELETE USING (auth.uid() = profile_id);

-- Enable RLS on payments table
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Payments: Users can only access their own payment records
CREATE POLICY "Users can view own payments" ON public.payments
  FOR SELECT USING (auth.uid() = profile_id);

CREATE POLICY "Users can create own payments" ON public.payments
  FOR INSERT WITH CHECK (auth.uid() = profile_id);

-- Enable RLS on addresses table
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;

-- Addresses: Users can only manage their own addresses
CREATE POLICY "Users can view own addresses" ON public.addresses
  FOR SELECT USING (auth.uid() = profile_id);

CREATE POLICY "Users can create own addresses" ON public.addresses
  FOR INSERT WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can update own addresses" ON public.addresses
  FOR UPDATE USING (auth.uid() = profile_id);

CREATE POLICY "Users can delete own addresses" ON public.addresses
  FOR DELETE USING (auth.uid() = profile_id);

-- Enable RLS on caregivers table
ALTER TABLE public.caregivers ENABLE ROW LEVEL SECURITY;

-- Caregivers: Read-only access for all authenticated users (for matching), admin write access
CREATE POLICY "Authenticated users can view caregivers" ON public.caregivers
  FOR SELECT TO authenticated USING (true);

-- Services: Public read access for service information
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view services" ON public.services
  FOR SELECT USING (true);

-- Waitlist: No user access after submission (will be admin-only managed)
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Create a trigger to automatically create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (new.id, new.raw_user_meta_data->>'name', new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists and create new one
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create a security definer function for admin checks (for future admin features)
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid DEFAULT auth.uid())
RETURNS boolean AS $$
BEGIN
  -- For now, return false. This can be enhanced later with admin role system
  RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;
