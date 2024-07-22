export type VesselsApiResponse = Vessel[];

export type Vessel = {
  name: string;
  timestamp: number;
  destination: string;
  shipType: number;
  mmsi: number;
  callSign: string;
  imo: number;
  draught: number;
  eta: number;
  posType: number;
  referencePointA: number;
  referencePointB: number;
  referencePointC: number;
  referencePointD: number;
};
