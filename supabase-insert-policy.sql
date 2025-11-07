-- Add INSERT policy for user_profiles
-- This allows new users to create their own profile with 1 free credit
CREATE POLICY "Users can insert own profile" ON public.user_profiles
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

