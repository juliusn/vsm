'use client';

import { createContext, useContext } from 'react';

type Props = {
  children: React.ReactNode;
  vessels: AppTypes.Vessel[];
};

const Context = createContext<AppTypes.Vessel[] | null>(null);

export const VesselProvider = ({ children, vessels }: Props) => {
  return <Context.Provider value={vessels}>{children}</Context.Provider>;
};

export const useVessels = () => {
  const context = useContext(Context);

  if (!context) {
    throw new Error('useVessels must be used within VesselProvider.');
  }

  return context;
};
