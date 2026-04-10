ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS onboarded boolean DEFAULT false;
UPDATE public.profiles SET onboarded = true WHERE display_name IS NOT NULL AND display_name != '';