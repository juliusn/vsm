'use client';

import { reducer } from '@/lib/reducer';
import { Action } from '@/lib/types/context';
import { createContext, Dispatch, useContext, useReducer } from 'react';

export type InitialDockingValues = {
  dockings: AppTypes.Docking[];
  dockingEvents: AppTypes.DockingEvent[];
};

type DockingContextType = InitialDockingValues & {
  dispatchDockings: Dispatch<Action<AppTypes.Docking>>;
  dispatchDockingEvents: Dispatch<Action<AppTypes.DockingEvent>>;
};

type DockingProviderProps = {
  children: React.ReactNode;
} & InitialDockingValues;

const DockingContext = createContext<DockingContextType | null>(null);

export const DockingProvider = ({
  children,
  dockings: initialDockings,
  dockingEvents: initialDockingEvents,
}: DockingProviderProps) => {
  const [dockings, dispatchDockings] = useReducer(
    reducer<AppTypes.Docking>,
    initialDockings
  );
  const [dockingEvents, dispatchDockingEvents] = useReducer(
    reducer<AppTypes.DockingEvent>,
    initialDockingEvents
  );
  return (
    <DockingContext.Provider
      value={{
        dockings,
        dockingEvents,
        dispatchDockings,
        dispatchDockingEvents,
      }}>
      {children}
    </DockingContext.Provider>
  );
};

export const useDockings = () => {
  const context = useContext(DockingContext);

  if (!context) {
    throw new Error('useDockings must be used within DockingProvider.');
  }

  return context;
};
