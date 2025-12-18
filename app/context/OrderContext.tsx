'use client';

import { reducer } from '@/lib/reducer';
import { Action } from '@/lib/types/context';
import { OrderData } from '@/lib/types/order';
import { OrderPermission } from '@/lib/types/query-types';
import { createContext, Dispatch, useContext, useReducer } from 'react';

type ContextType = {
  orders: OrderData[];
  dispatchOrders: Dispatch<Action<OrderData>>;
  orderPermissions: OrderPermission[];
};

type Props = {
  children: React.ReactNode;
  initialOrders: OrderData[];
  initialOrderPermissions: OrderPermission[];
};

const Context = createContext<ContextType | null>(null);

export const OrderProvider = ({
  children,
  initialOrders,
  initialOrderPermissions,
}: Props) => {
  const [orders, dispatchOrders] = useReducer(
    reducer<OrderData>,
    initialOrders
  );

  return (
    <Context.Provider
      value={{
        orders,
        dispatchOrders,
        orderPermissions: initialOrderPermissions,
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
