'use client';

import { reducer } from '@/lib/reducer';
import { Action } from '@/lib/types/context';
import { Order } from '@/lib/types/QueryTypes';
import { createContext, Dispatch, useContext, useReducer } from 'react';

type ContextType = {
  orderData: Order[];
  dispatchOrderData: Dispatch<Action<Order>>;
};

type Props = {
  children: React.ReactNode;
  initialOrderData: Order[];
};

const Context = createContext<ContextType | null>(null);

export const OrderDataProvider = ({ children, initialOrderData }: Props) => {
  const [orderData, dispatchOrderData] = useReducer(
    reducer<Order>,
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
