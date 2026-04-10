ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS subscription_tier TEXT NOT NULL DEFAULT 'free';

UPDATE public.profiles
SET subscription_tier = COALESCE(subscription_tier, 'free')
WHERE subscription_tier IS NULL;

ALTER TABLE public.profiles
ADD CONSTRAINT profiles_subscription_tier_check
CHECK (subscription_tier IN ('free', 'premium'));
