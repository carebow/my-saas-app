-- Drop all RLS policies that reference profile_id or id columns
-- Health Profiles
DROP POLICY IF EXISTS "Users can view own health profile" ON health_profiles;
DROP POLICY IF EXISTS "Users can update own health profile" ON health_profiles;
DROP POLICY IF EXISTS "Users can insert own health profile" ON health_profiles;

-- Addresses
DROP POLICY IF EXISTS "Users can manage their addresses" ON addresses;
DROP POLICY IF EXISTS "Users can view their addresses" ON addresses;
DROP POLICY IF EXISTS "Users can view own addresses" ON addresses;
DROP POLICY IF EXISTS "Users can create own addresses" ON addresses;
DROP POLICY IF EXISTS "Users can update own addresses" ON addresses;
DROP POLICY IF EXISTS "Users can delete own addresses" ON addresses;

-- Care Recipients
DROP POLICY IF EXISTS "Users can manage their care recipients" ON care_recipients;
DROP POLICY IF EXISTS "Users can view their care recipients" ON care_recipients;
DROP POLICY IF EXISTS "Users can view own care recipients" ON care_recipients;
DROP POLICY IF EXISTS "Users can insert own care recipients" ON care_recipients;
DROP POLICY IF EXISTS "Users can update own care recipients" ON care_recipients;
DROP POLICY IF EXISTS "Users can delete own care recipients" ON care_recipients;

-- Bookings
DROP POLICY IF EXISTS "Users can manage their bookings" ON bookings;
DROP POLICY IF EXISTS "Users can view their bookings" ON bookings;
DROP POLICY IF EXISTS "Users can view own bookings" ON bookings;
DROP POLICY IF EXISTS "Users can create own bookings" ON bookings;
DROP POLICY IF EXISTS "Users can update own bookings" ON bookings;
DROP POLICY IF EXISTS "Users can delete own bookings" ON bookings;

-- Payments
DROP POLICY IF EXISTS "Users can create payments" ON payments;
DROP POLICY IF EXISTS "Users can view their payments" ON payments;
DROP POLICY IF EXISTS "Users can view own payments" ON payments;
DROP POLICY IF EXISTS "Users can create own payments" ON payments;

-- Profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;