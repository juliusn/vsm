'use client';

import { reducer } from '@/lib/reducer';
import { Action } from '@/lib/types/context';
import { createContext, Dispatch, useContext, useReducer } from 'react';

export type DockingState = {
  dockings: AppTypes.Docking[];
  dockingEvents: AppTypes.DockingEvent[];
};

type DockingContextType = DockingState & {
  dispatchDockings: Dispatch<Action<AppTypes.Docking>>;
  dispatchDockingEvents: Dispatch<Action<AppTypes.DockingEvent>>;
};

type DockingProviderProps = {
  children: React.ReactNode;
  initialState: DockingState;
};

const DockingContext = createContext<DockingContextType | null>(null);

export const DockingProvider = ({
  children,
  initialState,
}: DockingProviderProps) => {
  const [dockings, dispatchDockings] = useReducer(
    reducer<AppTypes.Docking>,
    initialState.dockings
  );
  const [dockingEvents, dispatchDockingEvents] = useReducer(
    reducer<AppTypes.DockingEvent>,
    initialState.dockingEvents
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
