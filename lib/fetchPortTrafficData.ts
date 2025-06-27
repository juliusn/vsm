import { LocationState } from '@/app/context/LocationContext';
import { createClient } from './supabase/server';
import { berthingsQuery } from './queries';

export const fetchPortTrafficData = async (): Promise<
  | {
      locationState: LocationState;
      vessels: AppTypes.Vessel[];
      berthings: AppTypes.Berthing[];
    }
  | undefined
> => {
  const supabase = await createClient();
  const vesselsResponse = await fetch(
    'https://meri.digitraffic.fi/api/ais/v1/vessels'
  );
  const [
    locationsResponse,
    portAreasResponse,
    berthsResponse,
    berthingsResponse,
  ] = await Promise.all([
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
    supabase
      .from('berthings')
      .select(berthingsQuery)
      .order('created_at', { ascending: false }),
  ]);

  const success =
    vesselsResponse.ok &&
    locationsResponse.data &&
    portAreasResponse.data &&
    berthsResponse.data &&
    berthingsResponse.data;

  if (success) {
    const vesselsData = (await vesselsResponse.json()) as AppTypes.Vessel[];
    const vessels = vesselsData
      .filter((vessel) => vessel.imo !== 0)
      .filter(
        (vessel, index, array) =>
          array.findIndex((v) => v.imo === vessel.imo) === index
      );
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
    vessels.sort((a, b) => a.timestamp - b.timestamp);
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
      locationState: {
        locations,
        portAreas: filteredPortAreas,
        berths: filteredBerths,
      },
      vessels,
      berthings: berthingsResponse.data,
    };
  }
};
