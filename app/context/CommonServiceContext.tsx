'use client';

import { reducer } from '@/lib/reducer';
import { Action } from '@/lib/types/context';
import { CommonService } from '@/lib/types/query-types';
import { WithDictionary } from '@/lib/types/translation';
import { createContext, Dispatch, useContext, useReducer } from 'react';

type ContextType = {
  commonServices: WithDictionary<CommonService>[];
  dispatch: Dispatch<Action<WithDictionary<CommonService>>>;
};

const Context = createContext<ContextType | null>(null);

type Props = {
  children: React.ReactNode;
  initialValues: WithDictionary<CommonService>[];
};

export const CommonServiceProvider = ({ children, initialValues }: Props) => {
  const [commonServices, dispatch] = useReducer(
    reducer<WithDictionary<CommonService>>,
    initialValues
  );
  return (
    <Context.Provider value={{ commonServices, dispatch }}>
      {children}
    </Context.Provider>
  );
};

export const useCommonServices = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error(
      `useCommonServices must be used within CommonServiceProvider.`
    );
  }
  return context;
};
