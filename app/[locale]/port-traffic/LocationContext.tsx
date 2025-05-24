'use client';

import { createContext, useContext } from 'react';

export type InitialLocationValues = {
  vessels: AppTypes.Vessel[];
  locations: AppTypes.Location[];
  portAreas: AppTypes.PortArea[];
  berths: AppTypes.Berth[];
};

type LocationProviderProps = {
  children: React.ReactNode;
} & InitialLocationValues;

const LocationContext = createContext<InitialLocationValues | null>(null);

export const LocationProvider = ({
  children,
  vessels,
  locations,
  portAreas,
  berths,
}: LocationProviderProps) => {
  return (
    <LocationContext.Provider
      value={{
        vessels,
        locations,
        portAreas,
        berths,
      }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocations = () => {
  const context = useContext(LocationContext);

  if (!context) {
    throw new Error('useLocations must be used within LocationProvider.');
  }

  return context;
};
