-- Fix search path security issue for the log_waitlist_access function
CREATE OR REPLACE FUNCTION public.log_waitlist_access()
RETURNS TRIGGER AS $$
BEGIN
    -- Log access attempts for security monitoring
    RAISE LOG 'WAITLIST_ACCESS: operation=% user=% timestamp=%', 
        TG_OP, auth.uid(), now();
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;