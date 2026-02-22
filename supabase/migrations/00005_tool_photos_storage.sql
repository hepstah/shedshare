-- Storage bucket for tool photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('tool-photos', 'tool-photos', true);

-- Allow authenticated users to upload photos
CREATE POLICY "Authenticated users can upload tool photos"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'tool-photos');

-- Allow anyone to view tool photos (public bucket)
CREATE POLICY "Anyone can view tool photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'tool-photos');

-- Allow users to update their own uploads
CREATE POLICY "Users can update own tool photos"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'tool-photos' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow users to delete their own uploads
CREATE POLICY "Users can delete own tool photos"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'tool-photos' AND (storage.foldername(name))[1] = auth.uid()::text);
