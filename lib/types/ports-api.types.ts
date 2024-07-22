import { FeatureCollection, Point, Feature } from 'geojson';

export type PortsApiResponse = {
  dataUpdatedTime: string;
  ssnLocations: SsnLocations;
  portAreas: PortAreas;
  berths: Berths;
};

export type SsnLocations = FeatureCollection<Point, SsnLocationProperties> & {
  dataUpdatedTime: string;
};

export type SsnLocationProperties = {
  locode: string;
  locationName: string;
  country: string;
};

export type PortAreas = FeatureCollection<Point, PortAreaProperties> & {
  dataUpdatedTime: string;
  features: PortAreaFeature[];
};

export type PortAreaProperties = {
  locode: string;
  portAreaName: string;
};

export type PortAreaFeature = Feature<Point, PortAreaProperties> & {
  portAreaCode: string;
};

export type Berths = {
  berths: Berth[];
  dataUpdatedTime: string;
};

export type Berth = {
  locode: string;
  portAreaCode: string;
  berthCode: string;
  berthName: string;
};
