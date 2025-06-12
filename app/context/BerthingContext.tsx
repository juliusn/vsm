'use client';

import { reducer } from '@/lib/reducer';
import { Action } from '@/lib/types/context';
import { createContext, Dispatch, useContext, useReducer } from 'react';

export type BerthingState = {
  berthings: AppTypes.Berthing[];
  portEvents: AppTypes.PortEvent[];
};

type BerthingContextType = BerthingState & {
  dispatchBerthings: Dispatch<Action<AppTypes.Berthing>>;
  dispatchPortEvents: Dispatch<Action<AppTypes.PortEvent>>;
};

type BerthingProviderProps = {
  children: React.ReactNode;
  initialState: BerthingState;
};

const BerthingContext = createContext<BerthingContextType | null>(null);

export const BerthingProvider = ({
  children,
  initialState,
}: BerthingProviderProps) => {
  const [berthings, dispatchBerthings] = useReducer(
    reducer<AppTypes.Berthing>,
    initialState.berthings
  );
  const [portEvents, dispatchPortEvents] = useReducer(
    reducer<AppTypes.PortEvent>,
    initialState.portEvents
  );
  return (
    <BerthingContext.Provider
      value={{
        berthings: berthings,
        portEvents: portEvents,
        dispatchBerthings: dispatchBerthings,
        dispatchPortEvents: dispatchPortEvents,
      }}>
      {children}
    </BerthingContext.Provider>
  );
};

export const useBerthings = () => {
  const context = useContext(BerthingContext);

  if (!context) {
    throw new Error('useBerthings must be used within BerthingProvider.');
  }

  return context;
};
