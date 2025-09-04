-- Add comprehensive RLS policies for all sensitive tables

-- Enable RLS on profiles table and add policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" 
ON profiles FOR SELECT 
USING (auth.uid()::text = id);

CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE 
USING (auth.uid()::text = id);

CREATE POLICY "Users can insert own profile" 
ON profiles FOR INSERT 
WITH CHECK (auth.uid()::text = id);

-- Enable RLS on health_profiles table and add policies  
ALTER TABLE health_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own health profile" 
ON health_profiles FOR SELECT 
USING (auth.uid()::text = profile_id);

CREATE POLICY "Users can update own health profile" 
ON health_profiles FOR UPDATE 
USING (auth.uid()::text = profile_id);

CREATE POLICY "Users can insert own health profile" 
ON health_profiles FOR INSERT 
WITH CHECK (auth.uid()::text = profile_id);

-- Enable RLS on addresses table and add policies
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own addresses" 
ON addresses FOR SELECT 
USING (auth.uid()::text = profile_id);

CREATE POLICY "Users can create own addresses" 
ON addresses FOR INSERT 
WITH CHECK (auth.uid()::text = profile_id);

CREATE POLICY "Users can update own addresses" 
ON addresses FOR UPDATE 
USING (auth.uid()::text = profile_id);

CREATE POLICY "Users can delete own addresses" 
ON addresses FOR DELETE 
USING (auth.uid()::text = profile_id);

-- Enable RLS on care_recipients table and add policies
ALTER TABLE care_recipients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own care recipients" 
ON care_recipients FOR SELECT 
USING (auth.uid()::text = profile_id);

CREATE POLICY "Users can insert own care recipients" 
ON care_recipients FOR INSERT 
WITH CHECK (auth.uid()::text = profile_id);

CREATE POLICY "Users can update own care recipients" 
ON care_recipients FOR UPDATE 
USING (auth.uid()::text = profile_id);

CREATE POLICY "Users can delete own care recipients" 
ON care_recipients FOR DELETE 
USING (auth.uid()::text = profile_id);

-- Enable RLS on bookings table and add policies
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bookings" 
ON bookings FOR SELECT 
USING (auth.uid()::text = profile_id);

CREATE POLICY "Users can create own bookings" 
ON bookings FOR INSERT 
WITH CHECK (auth.uid()::text = profile_id);

CREATE POLICY "Users can update own bookings" 
ON bookings FOR UPDATE 
USING (auth.uid()::text = profile_id);

CREATE POLICY "Users can delete own bookings" 
ON bookings FOR DELETE 
USING (auth.uid()::text = profile_id);

-- Enable RLS on payments table and add policies
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payments" 
ON payments FOR SELECT 
USING (auth.uid()::text = profile_id);

CREATE POLICY "Users can create own payments" 
ON payments FOR INSERT 
WITH CHECK (auth.uid()::text = profile_id);