import { createClient } from '@/lib/supabase/server';
import { NewOrderContent } from './NewOrderContent';
import { NewOrderForm } from './NewOrderForm';

export default async function OrdersPage() {
  const supabase = createClient();

  const locationsResponse = await supabase
    .from('locations')
    .select()
    .eq('enabled', true);

  if (locationsResponse.error) {
    return null;
  }
  const locodes = locationsResponse.data.map((location) => location.locode);

  const portAreasResponse = await supabase
    .from('port_areas')
    .select()
    .eq('enabled', true)
    .in('locode', locodes);

  if (portAreasResponse.error) {
    return null;
  }

  const portAreaCodes = portAreasResponse.data.map(
    (portArea) => portArea.port_area_code
  );

  const berthsResponse = await supabase
    .from('berths')
    .select()
    .eq('enabled', true)
    .in('locode', locodes)
    .in('port_area_code', portAreaCodes);

  if (berthsResponse.error) {
    return null;
  }

  return (
    <NewOrderContent>
      <NewOrderForm
        locations={locationsResponse.data}
        portAreas={portAreasResponse.data}
        berths={berthsResponse.data}
      />
    </NewOrderContent>
  );
}
