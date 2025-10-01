'use client';

import { reducer } from '@/lib/reducer';
import { Action } from '@/lib/types/context';
import { BerthService } from '@/lib/types/query-types';
import { WithDictionary } from '@/lib/types/translation';
import { createContext, Dispatch, useContext, useReducer } from 'react';

type ContextType = {
  berthServices: WithDictionary<BerthService>[];
  dispatch: Dispatch<Action<WithDictionary<BerthService>>>;
};

const Context = createContext<ContextType | null>(null);

type Props = {
  children: React.ReactNode;
  initialValues: WithDictionary<BerthService>[];
};

export const BerthServiceProvider = ({ children, initialValues }: Props) => {
  const [berthServices, dispatch] = useReducer(
    reducer<WithDictionary<BerthService>>,
    initialValues
  );
  return (
    <Context.Provider value={{ berthServices, dispatch }}>
      {children}
    </Context.Provider>
  );
};

export const useBerthServices = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error(
      `useBerthServices must be used within BerthServiceProvider.`
    );
  }
  return context;
};
