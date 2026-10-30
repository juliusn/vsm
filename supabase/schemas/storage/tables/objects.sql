CREATE POLICY "Avatar images are publicly accessible." ON "storage"."objects"
  FOR SELECT
  TO PUBLIC
  USING ((bucket_id = 'avatars'::text));

CREATE POLICY "Users can upload their own avatar" ON "storage"."objects"
  FOR INSERT
  TO "authenticated"
  WITH CHECK (((bucket_id = 'avatars'::text) AND ((storage.foldername(name))[1] = (( SELECT auth.uid() AS uid))::text)));
