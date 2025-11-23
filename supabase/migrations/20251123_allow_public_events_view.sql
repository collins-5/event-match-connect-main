-- Allow public access to view events (for browsing before/without auth)
DROP POLICY "Anyone can view events" ON public.events;

CREATE POLICY "Anyone can view events"
  ON public.events FOR SELECT
  TO public
  USING (true);
