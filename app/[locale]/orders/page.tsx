import { NewOrderContent } from './NewOrderContent';
import { NewOrderForm } from './NewOrderForm';

export type Berth = {
  locode: string;
  portAreaCode: string;
  berthCode: string;
  berthName: string;
};

export type Ship = {
  name: string;
  timestamp: number;
  destination: string;
  draught: number;
  eta: number;
  posType: number;
  referencePointA: number;
  referencePointB: number;
  referencePointC: number;
  referencePointD: number;
  shipType: number;
  mmsi: number;
  callSign: string;
  imo: number;
};

export type PortArea = {
  locode: string;
  type: string;
  geometry: null;
  properties: {
    locode: string;
    portAreaName: string;
  };
  portAreaCode: string;
};

export default async function OrdersPage() {
  const res = await fetch('https://meri.digitraffic.fi/api/port-call/v1/ports');
  if (!res.ok) {
    throw new Error(`No port data.`);
  }
  const supportedPortAreaCodes = ['LS', 'ES', 'VUOS'];
  const data: {
    portAreas: { features: PortArea[] };
    berths: { berths: Berth[] };
  } = await res.json();
  const portAreas: PortArea[] = data.portAreas.features.filter((portArea) =>
    supportedPortAreaCodes.includes(portArea.portAreaCode)
  );
  const berths: Berth[] = data.berths.berths.filter(
    (berth) =>
      berth.locode === 'FIHEL' &&
      supportedPortAreaCodes.includes(berth.portAreaCode)
  );

  return (
    <NewOrderContent>
      <NewOrderForm portAreas={portAreas} berths={berths} />
    </NewOrderContent>
  );
}
