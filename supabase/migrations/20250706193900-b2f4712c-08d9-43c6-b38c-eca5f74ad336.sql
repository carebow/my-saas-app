-- Fix the profiles table to use text instead of uuid for Clerk user IDs
-- This resolves the "invalid input syntax for type uuid" errors

-- Step 1: Drop RLS policies that depend on the id column
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

-- Step 2: Drop foreign key constraints that reference profiles.id
ALTER TABLE health_profiles DROP CONSTRAINT IF EXISTS health_profiles_profile_id_fkey;
ALTER TABLE addresses DROP CONSTRAINT IF EXISTS addresses_profile_id_fkey;
ALTER TABLE care_recipients DROP CONSTRAINT IF EXISTS care_recipients_profile_id_fkey;
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_profile_id_fkey;
ALTER TABLE payments DROP CONSTRAINT IF EXISTS payments_profile_id_fkey;

-- Step 3: Change the profiles.id column from uuid to text
ALTER TABLE profiles ALTER COLUMN id TYPE text;

-- Step 4: Change related foreign key columns to text
ALTER TABLE health_profiles ALTER COLUMN profile_id TYPE text;
ALTER TABLE addresses ALTER COLUMN profile_id TYPE text;
ALTER TABLE care_recipients ALTER COLUMN profile_id TYPE text;
ALTER TABLE bookings ALTER COLUMN profile_id TYPE text;
ALTER TABLE payments ALTER COLUMN profile_id TYPE text;

-- Step 5: Recreate foreign key constraints
ALTER TABLE health_profiles ADD CONSTRAINT health_profiles_profile_id_fkey 
  FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE;
  
ALTER TABLE addresses ADD CONSTRAINT addresses_profile_id_fkey 
  FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE;
  
ALTER TABLE care_recipients ADD CONSTRAINT care_recipients_profile_id_fkey 
  FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE;
  
ALTER TABLE bookings ADD CONSTRAINT bookings_profile_id_fkey 
  FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE;
  
ALTER TABLE payments ADD CONSTRAINT payments_profile_id_fkey 
  FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- Step 6: Recreate RLS policies with text comparison
CREATE POLICY "Users can view own profile" 
ON profiles FOR SELECT 
USING (auth.uid()::text = id);

CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE 
USING (auth.uid()::text = id);

CREATE POLICY "Users can insert own profile" 
ON profiles FOR INSERT 
WITH CHECK (auth.uid()::text = id);