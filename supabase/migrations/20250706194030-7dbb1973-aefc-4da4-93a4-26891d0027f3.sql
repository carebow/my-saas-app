-- Recreate profiles table with text ID to support Clerk user IDs
-- First backup the existing data
CREATE TABLE profiles_backup AS SELECT * FROM profiles;

-- Drop dependent tables' foreign key constraints
ALTER TABLE health_profiles DROP CONSTRAINT IF EXISTS health_profiles_profile_id_fkey;
ALTER TABLE addresses DROP CONSTRAINT IF EXISTS addresses_profile_id_fkey;
ALTER TABLE care_recipients DROP CONSTRAINT IF EXISTS care_recipients_profile_id_fkey;
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_profile_id_fkey;
ALTER TABLE payments DROP CONSTRAINT IF EXISTS payments_profile_id_fkey;

-- Drop and recreate the profiles table
DROP TABLE profiles CASCADE;

CREATE TABLE profiles (
  id text PRIMARY KEY,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  name text NOT NULL,
  email text NOT NULL,
  phone text
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Recreate RLS policies
CREATE POLICY "Users can view own profile" 
ON profiles FOR SELECT 
USING (auth.uid()::text = id);

CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE 
USING (auth.uid()::text = id);

CREATE POLICY "Users can insert own profile" 
ON profiles FOR INSERT 
WITH CHECK (auth.uid()::text = id);

-- Change dependent table columns to text
ALTER TABLE health_profiles ALTER COLUMN profile_id TYPE text;
ALTER TABLE addresses ALTER COLUMN profile_id TYPE text;
ALTER TABLE care_recipients ALTER COLUMN profile_id TYPE text;
ALTER TABLE bookings ALTER COLUMN profile_id TYPE text;
ALTER TABLE payments ALTER COLUMN profile_id TYPE text;

-- Recreate foreign key constraints
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

-- Clean up backup table
DROP TABLE profiles_backup;