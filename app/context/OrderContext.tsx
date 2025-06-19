'use client';

import { reducer } from '@/lib/reducer';
import { Action } from '@/lib/types/context';
import { createContext, Dispatch, useContext, useReducer } from 'react';

type ContextType = {
  orderData: AppTypes.OrderData[];
  dispatchOrderData: Dispatch<Action<AppTypes.OrderData>>;
};

type Props = {
  children: React.ReactNode;
  initialOrderData: AppTypes.OrderData[];
};

const Context = createContext<ContextType | null>(null);

export const OrderDataProvider = ({ children, initialOrderData }: Props) => {
  const [orderData, dispatchOrderData] = useReducer(
    reducer<AppTypes.OrderData>,
    initialOrderData
  );

  return (
    <Context.Provider
      value={{
        orderData,
        dispatchOrderData,
      }}>
      {children}
    </Context.Provider>
  );
};

export const useOrderData = () => {
  const context = useContext(Context);

  if (!context) {
    throw new Error('useOrderData must be used within OrderDataProvider.');
  }

  return context;
};
