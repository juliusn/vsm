import { createClient } from '@/lib/supabase/server';
import { LocationProvider } from './LocationContext';

export default async function LocodeLayout({
  children,
  params: { locode },
}: {
  children: React.ReactNode;
  params: { locode: string };
}) {
  const supabase = createClient();
  const [locationsResponse, portAreasResponse, berthsResponse] =
    await Promise.all([
      supabase.from('locations').select('*').eq('locode', locode).single(),
      supabase.from('port_areas').select('*').eq('locode', locode),
      supabase.from('berths').select('*').eq('locode', locode),
    ]);
  const location = locationsResponse.data;
  const portAreas = portAreasResponse.data;
  const berths = berthsResponse.data;

  return (
    <LocationProvider value={{ location, portAreas, berths }}>
      {children}
    </LocationProvider>
  );
}
