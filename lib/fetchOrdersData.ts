import { LocationState } from '@/app/context/LocationContext';
import { createClient } from './supabase/server';
import {
  berthingsSelector,
  counterpartiesSelector,
  ordersSelector,
} from './querySelectors';
import { Berthing, Counterparty, Order } from './types/QueryTypes';

type Result = {
  locationState: LocationState;
  vessels: AppTypes.Vessel[];
  berthings: Berthing[];
  berthServices: AppTypes.BerthService[];
  commonServices: AppTypes.CommonService[];
  orders: Order[];
  counterparties: Counterparty[];
};

export const fetchOrdersData = async (): Promise<Result | undefined> => {
  const supabase = await createClient();

  const [
    vesselsResponse,
    locationsResponse,
    portAreasResponse,
    berthsResponse,
    berthingsResponse,
    portEventsResponse,
    berthServicesResponse,
    commonServicesResponse,
    ordersResponse,
    counterpartiesResponse,
  ] = await Promise.all([
    fetch('https://meri.digitraffic.fi/api/ais/v1/vessels'),
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
    supabase.from('berthings').select(berthingsSelector),
    supabase.from('port_events').select(),
    supabase.from('berth_services').select(),
    supabase.from('common_services').select(),
    supabase.from('orders').select(ordersSelector),
    supabase.from('counterparties').select(counterpartiesSelector),
  ]);

  const success =
    vesselsResponse.ok &&
    locationsResponse.data &&
    portAreasResponse.data &&
    berthsResponse.data &&
    berthingsResponse.data &&
    portEventsResponse.data &&
    berthServicesResponse.data &&
    commonServicesResponse.data &&
    ordersResponse.data &&
    counterpartiesResponse.data;

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
      berthServices: berthServicesResponse.data.map((service) => ({
        ...service,
        titles: service.titles as AppTypes.ServiceTitles,
      })),
      commonServices: commonServicesResponse.data.map((service) => ({
        ...service,
        titles: service.titles as AppTypes.ServiceTitles,
      })),
      orders: ordersResponse.data.map((order) => ({
        ...order,
        common_services: order.common_services.map((service) => ({
          ...service,
          titles: service.titles as AppTypes.ServiceTitles,
        })),
      })),
      counterparties: counterpartiesResponse.data,
    };
  }
};
