'use client';

import { OrderData } from '@/lib/types/order';
import { Berthing, OrderPermission } from '@/lib/types/query-types';
import { createContext, Dispatch, useContext, useReducer } from 'react';

type OrderState = {
  orders: OrderData[];
  orderPermissions: OrderPermission[];
  berthings: Berthing[];
};

type OrderAction =
  | { type: 'orderAdded'; item: OrderData }
  | { type: 'orderChanged'; item: OrderData }
  | { type: 'orderDeleted'; id: OrderData['id'] }
  | { type: 'berthingAdded'; item: Berthing }
  | { type: 'berthingChanged'; item: Berthing }
  | { type: 'berthingDeleted'; id: Berthing['id'] };

type ContextType = OrderState & {
  dispatch: Dispatch<OrderAction>;
};

type Props = {
  children: React.ReactNode;
  initialOrders: OrderData[];
  initialOrderPermissions: OrderPermission[];
  initialBerthings: Berthing[];
};

const Context = createContext<ContextType | null>(null);

export const OrderProvider = ({
  children,
  initialOrders,
  initialOrderPermissions,
  initialBerthings,
}: Props) => {
  const [state, dispatch] = useReducer(orderReducer, {
    orders: initialOrders,
    berthings: initialBerthings,
    orderPermissions: initialOrderPermissions,
  });

  return (
    <Context.Provider
      value={{
        orders: state.orders,
        orderPermissions: state.orderPermissions,
        berthings: state.berthings,
        dispatch,
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

function orderReducer(state: OrderState, action: OrderAction): OrderState {
  switch (action.type) {
    case 'orderAdded':
      return {
        ...state,
        orders: [...state.orders, action.item],
      };

    case 'orderChanged':
      return {
        ...state,
        orders: state.orders.map((order) =>
          order.id === action.item.id ? action.item : order
        ),
      };

    case 'orderDeleted':
      return {
        ...state,
        orders: state.orders.filter((order) => order.id !== action.id),
      };

    case 'berthingAdded':
      return {
        ...state,
        berthings: [...state.berthings, action.item],
      };

    case 'berthingChanged':
      return {
        ...state,
        berthings: state.berthings.map((berthing) =>
          berthing.id === action.item.id ? action.item : berthing
        ),
        orders: state.orders.map((order) =>
          order.berthing.id === action.item.id
            ? { ...order, berthing: action.item }
            : order
        ),
      };

    case 'berthingDeleted':
      return {
        ...state,
        berthings: state.berthings.filter(
          (berthing) => berthing.id !== action.id
        ),
      };

    default:
      return state;
  }
}
