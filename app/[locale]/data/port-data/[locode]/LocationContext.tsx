'use client';

import { createContext, useContext } from 'react';

type LocationContextType = {
  location: AppTypes.Location | null;
  portAreas: AppTypes.PortArea[] | null;
  berths: AppTypes.Berth[] | null;
};

const LocationContext = createContext<LocationContextType>({
  location: null,
  portAreas: null,
  berths: null,
});

export const useLocation = () => useContext(LocationContext);

export const LocationProvider = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: LocationContextType;
}) => {
  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};
