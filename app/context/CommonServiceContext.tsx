'use client';

import { reducer } from '@/lib/reducer';
import { Action } from '@/lib/types/context';
import { CommonService } from '@/lib/types/query-types';
import { WithDictionary } from '@/lib/types/translation';
import { createContext, Dispatch, useContext, useReducer } from 'react';

export type SortableCommonService = Omit<CommonService, 'sort_order'> & {
  sort_order: number;
};

type NormalizedService = WithDictionary<SortableCommonService>;

type ContextType = {
  commonServices: NormalizedService[];
  dispatch: Dispatch<Action<NormalizedService>>;
};

const Context = createContext<ContextType | null>(null);

type Props = {
  children: React.ReactNode;
  initialValues: NormalizedService[];
};

export const CommonServiceProvider = ({ children, initialValues }: Props) => {
  const [commonServices, dispatch] = useReducer(
    reducer<NormalizedService>,
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
