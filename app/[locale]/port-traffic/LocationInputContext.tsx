import { createContext, useContext, useState } from 'react';

type LocationInputsContextType = {
  locode: string | null;
  setLocode: React.Dispatch<React.SetStateAction<string | null>>;
  portArea: string | null;
  setPortArea: React.Dispatch<React.SetStateAction<string | null>>;
  berth: string | null;
  setBerth: React.Dispatch<React.SetStateAction<string | null>>;
};

export const LocationInputsContext =
  createContext<LocationInputsContextType | null>(null);

export const LocationInputsContextProvider = ({
  children,
  locations,
}: {
  children: React.ReactNode;
  locations: AppTypes.Location[];
}) => {
  const [locode, setLocode] = useState<string | null>(
    locations.length === 1 ? locations[0].locode : null
  );
  const [portArea, setPortArea] = useState<string | null>(null);
  const [berth, setBerth] = useState<string | null>(null);
  const state = { locode, setLocode, portArea, setPortArea, berth, setBerth };
  return (
    <LocationInputsContext.Provider value={state}>
      {children}
    </LocationInputsContext.Provider>
  );
};

export const useLocationInputs = (): LocationInputsContextType => {
  const context = useContext(LocationInputsContext);
  if (context === null)
    throw new Error(
      'useLocationInputs must be used within a LocationInputsContextProvider.Provider.'
    );
  return context;
};
