-- Fix critical infinite recursion in user_roles RLS policy
-- Drop the problematic recursive policy
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;

-- Create a safe policy that uses the has_role function instead
CREATE POLICY "Users can view own roles safely" 
ON public.user_roles
FOR SELECT 
TO authenticated
USING (user_id = auth.uid());

-- Also ensure we have proper admin access policy
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;

CREATE POLICY "Admins can manage all roles safely" 
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Fix caregiver security model - ensure caregiver_public_profiles is a proper table not view
-- First check if it's a view and convert to table if needed
DO $$
BEGIN
    -- Drop view if it exists and create proper table
    DROP VIEW IF EXISTS public.caregiver_public_profiles;
    
    -- Create the table if it doesn't exist
    CREATE TABLE IF NOT EXISTS public.caregiver_public_profiles (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        rating numeric DEFAULT 0,
        reviews_count integer DEFAULT 0,
        experience_years integer DEFAULT 0,
        created_at timestamp with time zone DEFAULT now(),
        updated_at timestamp with time zone DEFAULT now(),
        specialities text[],
        name text,
        languages text[],
        bio text,
        image_url text,
        verification_status text DEFAULT 'pending'
    );
    
    -- Enable RLS
    ALTER TABLE public.caregiver_public_profiles ENABLE ROW LEVEL SECURITY;
    
    -- Create policy for authenticated users to view verified caregivers
    DROP POLICY IF EXISTS "Authenticated users can view verified public profiles" ON public.caregiver_public_profiles;
    CREATE POLICY "Authenticated users can view verified caregivers"
    ON public.caregiver_public_profiles
    FOR SELECT
    TO authenticated
    USING (verification_status = 'verified');
    
    -- Create trigger to sync data from caregivers table (non-PII only)
    CREATE OR REPLACE FUNCTION sync_caregiver_public_data()
    RETURNS TRIGGER AS $sync$
    BEGIN
        -- Insert or update the public profile (no email/phone)
        INSERT INTO public.caregiver_public_profiles (
            id, rating, reviews_count, experience_years, 
            created_at, updated_at, specialities, name, 
            languages, bio, image_url, verification_status
        ) VALUES (
            NEW.id, NEW.rating, NEW.reviews_count, NEW.experience_years,
            NEW.created_at, NEW.updated_at, NEW.specialities, NEW.name,
            NEW.languages, NEW.bio, NEW.image_url, NEW.verification_status
        )
        ON CONFLICT (id) DO UPDATE SET
            rating = NEW.rating,
            reviews_count = NEW.reviews_count,
            experience_years = NEW.experience_years,
            updated_at = NEW.updated_at,
            specialities = NEW.specialities,
            name = NEW.name,
            languages = NEW.languages,
            bio = NEW.bio,
            image_url = NEW.image_url,
            verification_status = NEW.verification_status;
        
        RETURN NEW;
    END;
    $sync$ LANGUAGE plpgsql SECURITY DEFINER;
    
    -- Create the trigger
    DROP TRIGGER IF EXISTS sync_caregiver_public_trigger ON public.caregivers;
    CREATE TRIGGER sync_caregiver_public_trigger
        AFTER INSERT OR UPDATE ON public.caregivers
        FOR EACH ROW EXECUTE FUNCTION sync_caregiver_public_data();
    
    -- Sync existing data
    INSERT INTO public.caregiver_public_profiles (
        id, rating, reviews_count, experience_years, 
        created_at, updated_at, specialities, name, 
        languages, bio, image_url, verification_status
    )
    SELECT 
        id, rating, reviews_count, experience_years,
        created_at, updated_at, specialities, name,
        languages, bio, image_url, verification_status
    FROM public.caregivers
    ON CONFLICT (id) DO NOTHING;
    
END $$;

-- Update search_caregivers to use the table directly (no SECURITY DEFINER needed)
CREATE OR REPLACE FUNCTION public.search_caregivers(search_speciality text DEFAULT NULL::text, search_language text DEFAULT NULL::text)
RETURNS TABLE(id uuid, rating numeric, reviews_count integer, experience_years integer, verification_status text, specialities text[], languages text[], bio text, image_url text)
LANGUAGE plpgsql
STABLE
SET search_path TO 'public'
AS $function$
BEGIN
  -- Require user to be authenticated to search caregivers
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required to search caregiver information';
  END IF;

  -- Use the secure table with RLS (no SECURITY DEFINER needed)
  RETURN QUERY
  SELECT 
    cv.id,
    cv.rating,
    cv.reviews_count,
    cv.experience_years,
    cv.verification_status,
    cv.specialities,
    cv.languages,
    cv.bio,
    cv.image_url
  FROM public.caregiver_public_profiles cv
  WHERE (search_speciality IS NULL OR search_speciality = ANY(cv.specialities))
    AND (search_language IS NULL OR search_language = ANY(cv.languages));
END;
$function$;

-- Remove the old SECURITY DEFINER function completely
DROP FUNCTION IF EXISTS public.get_caregivers_safe();

-- Add the missing profiles trigger for new user handling
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Clean up redundant RLS policies
DROP POLICY IF EXISTS "Public can view services" ON public.services;
DROP POLICY IF EXISTS "Authenticated users can view public caregiver profiles" ON public.caregiver_profiles;