-- Now alter the column types after dropping policies
-- Drop foreign key constraints first
ALTER TABLE health_profiles DROP CONSTRAINT IF EXISTS health_profiles_profile_id_fkey;
ALTER TABLE addresses DROP CONSTRAINT IF EXISTS addresses_profile_id_fkey;
ALTER TABLE care_recipients DROP CONSTRAINT IF EXISTS care_recipients_profile_id_fkey;
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_profile_id_fkey;
ALTER TABLE payments DROP CONSTRAINT IF EXISTS payments_profile_id_fkey;

-- Change profiles.id from uuid to text
ALTER TABLE profiles ALTER COLUMN id TYPE text;

-- Change dependent columns to text
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