import { LocationState } from '@/app/context/LocationContext';
import { createClient } from './supabase/server';

export const fetchLocations = async (): Promise<LocationState | undefined> => {
  const supabase = await createClient();
  const [locationsResponse, portAreasResponse, berthsResponse] =
    await Promise.all([
      supabase
        .from('locations')
        .select()
        .eq('enabled', true)
        .order('location_name'),
      supabase
        .from('port_areas')
        .select()
        .eq('enabled', true)
        .order('port_area_name'),
      supabase.from('berths').select().eq('enabled', true).order('berth_name'),
    ]);

  const success =
    locationsResponse.data && portAreasResponse.data && berthsResponse.data;

  if (success) {
    const locations = locationsResponse.data;
    const locodes = locations.map((location) => location.locode);
    const filteredPortAreas = portAreasResponse.data.filter((portArea) =>
      locodes.includes(portArea.locode)
    );
    const filteredPortAreaCodes = filteredPortAreas.map(
      (portArea) => portArea.port_area_code
    );
    const filteredBerths = berthsResponse.data.filter(
      (berth) =>
        locodes.includes(berth.locode) &&
        filteredPortAreaCodes.includes(berth.port_area_code)
    );
    locations.sort((a, b) => a.location_name.localeCompare(b.location_name));
    filteredPortAreas.sort((a, b) => {
      const locIndexA = locations.findIndex((loc) => loc.locode === a.locode);
      const locIndexB = locations.findIndex((loc) => loc.locode === b.locode);
      if (locIndexA !== locIndexB) {
        return locIndexA - locIndexB;
      }
      return a.port_area_name.localeCompare(b.port_area_name);
    });
    filteredBerths.sort((a, b) => {
      const locIndexA = locations.findIndex((loc) => loc.locode === a.locode);
      const locIndexB = locations.findIndex((loc) => loc.locode === b.locode);
      if (locIndexA !== locIndexB) {
        return locIndexA - locIndexB;
      }
      const portAreaIndexA = filteredPortAreas.findIndex(
        (pa) => pa.port_area_code === a.port_area_code
      );
      const portAreaIndexB = filteredPortAreas.findIndex(
        (pa) => pa.port_area_code === b.port_area_code
      );
      if (portAreaIndexA !== portAreaIndexB) {
        return portAreaIndexA - portAreaIndexB;
      }
      return a.berth_name.localeCompare(b.berth_name);
    });
    return {
      locations,
      portAreas: filteredPortAreas,
      berths: filteredBerths,
    };
  }
};
