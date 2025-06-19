'use client';

import { reducer } from '@/lib/reducer';
import { Action } from '@/lib/types/context';
import { createContext, Dispatch, useContext, useReducer } from 'react';

type ContextType = {
  berthings: AppTypes.Berthing[];
  dispatchBerthings: Dispatch<Action<AppTypes.Berthing>>;
};

type Props = {
  children: React.ReactNode;
  initialBerthings: AppTypes.Berthing[];
};

const BerthingContext = createContext<ContextType | null>(null);

export const BerthingProvider = ({ children, initialBerthings }: Props) => {
  const [berthings, dispatchBerthings] = useReducer(
    reducer<AppTypes.Berthing>,
    initialBerthings
  );
  return (
    <BerthingContext.Provider
      value={{
        berthings,
        dispatchBerthings,
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
