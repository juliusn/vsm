'use client';

import { createContext, useContext } from 'react';

export enum ActionTypes {
  SET_DOCKINGS = 'SET_DOCKINGS',
  INSERT_DOCKING = 'INSERT_DOCKING',
  REMOVE_DOCKING = 'REMOVE_DOCKING',
  UPDATE_DOCKING = 'UPDATE_DOCKING',
  SET_DOCKING_EVENTS = 'SET_DOCKING_EVENTS',
  INSERT_DOCKING_EVENT = 'INSERT_DOCKING_EVENT',
  REMOVE_DOCKING_EVENT = 'REMOVE_DOCKING_EVENT',
  UPDATE_DOCKING_EVENT = 'UPDATE_DOCKING_EVENT',
}

type ContextType = {
  dockings: AppTypes.Docking[];
  dockingEvents: AppTypes.DockingEvent[];
};

const Context = createContext<ContextType | null>(null);

export const PortTrafficProvider = ({
  children,
  initialState,
}: {
  children: React.ReactNode;
  initialState: ContextType;
}) => {
  return <Context.Provider value={initialState}>{children}</Context.Provider>;
};

export const usePortTraffic = () => {
  const context = useContext(Context);

  if (!context) {
    throw new Error('usePortTraffic must be used within PortTrafficProvider.');
  }

  return context;
};
