-- 1. Create tables
CREATE TABLE public.plants (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  species text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.scans (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  plant_id uuid REFERENCES public.plants(id),
  image_url text,
  diagnosis jsonb NOT NULL,
  scanned_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Setup Storage (Run this in the SQL editor or create manually in the dashboard)
insert into storage.buckets (id, name, public) values ('scans', 'scans', true);

-- 3. Setup Row Level Security (RLS)
ALTER TABLE public.plants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own plants" ON public.plants FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own plants" ON public.plants FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own plants" ON public.plants FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own plants" ON public.plants FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own scans" ON public.scans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own scans" ON public.scans FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own scans" ON public.scans FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own scans" ON public.scans FOR DELETE USING (auth.uid() = user_id);

-- 4. Storage RLS
CREATE POLICY "Users can upload their own scans" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'scans' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Anyone can view scan images" ON storage.objects FOR SELECT USING (bucket_id = 'scans');
CREATE POLICY "Users can delete their own scans" ON storage.objects FOR DELETE USING (bucket_id = 'scans' AND auth.uid()::text = (storage.foldername(name))[1]);

-- 5. Feedback Table
CREATE TABLE public.scan_feedback (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  scan_id uuid REFERENCES public.scans(id) NOT NULL,
  was_correct boolean NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.scan_feedback ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can insert feedback" ON public.scan_feedback FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view own feedback" ON public.scan_feedback FOR SELECT USING (true);
