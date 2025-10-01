'use client';

import { reducer } from '@/lib/reducer';
import { Action } from '@/lib/types/context';
import { OrderData } from '@/lib/types/order';
import { createContext, Dispatch, useContext, useReducer } from 'react';

type ContextType = {
  orders: OrderData[];
  dispatchOrders: Dispatch<Action<OrderData>>;
};

type Props = {
  children: React.ReactNode;
  initialOrders: OrderData[];
};

const Context = createContext<ContextType | null>(null);

export const OrderProvider = ({ children, initialOrders }: Props) => {
  const [orders, dispatchOrders] = useReducer(
    reducer<OrderData>,
    initialOrders
  );

  return (
    <Context.Provider
      value={{
        orders,
        dispatchOrders,
      }}>
      {children}
    </Context.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(Context);

  if (!context) {
    throw new Error('useOrders must be used within OrderProvider.');
  }

  return context;
};
