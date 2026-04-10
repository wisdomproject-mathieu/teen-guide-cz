
CREATE OR REPLACE FUNCTION public.get_today_mood_counts()
RETURNS TABLE(mood_id text, count bigint)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT mood_id, count(DISTINCT user_id)::bigint as count
  FROM public.mood_logs
  WHERE created_at >= (now() AT TIME ZONE 'Europe/Prague')::date
  GROUP BY mood_id;
$$;
