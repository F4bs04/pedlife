-- Add CRM and phone fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN crm TEXT,
ADD COLUMN phone TEXT;

-- Update the handle_new_user function to include new fields
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, crm, phone)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.email,
    NEW.raw_user_meta_data ->> 'crm',
    NEW.raw_user_meta_data ->> 'phone'
  );
  RETURN NEW;
END;
$$;