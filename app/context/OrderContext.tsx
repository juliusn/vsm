'use client';

import { OrderData } from '@/lib/types/order';
import { Berthing, OrderPermission, PortEvent } from '@/lib/types/query-types';
import { createContext, Dispatch, useContext, useReducer } from 'react';

type OrderState = {
  orders: OrderData[];
  orderPermissions: OrderPermission[];
  berthings: Berthing[];
};

export type PortEventChanges = Partial<
  Pick<
    PortEvent,
    | 'default_duration_minutes'
    | 'default_standby_minutes'
    | 'max_assignees'
    | 'is_public'
  >
>;

type OrderAction =
  | { type: 'orderAdded'; item: OrderData }
  | { type: 'orderChanged'; item: OrderData }
  | { type: 'orderDeleted'; id: OrderData['id'] }
  | { type: 'berthingAdded'; item: Berthing }
  | { type: 'berthingChanged'; item: Berthing }
  | { type: 'berthingDeleted'; id: Berthing['id'] }
  | {
      type: 'portEventChanged';
      id: PortEvent['id'];
      changes: PortEventChanges;
    };

type ContextType = OrderState & {
  dispatch: Dispatch<OrderAction>;
};

type Props = {
  children: React.ReactNode;
  initialOrders: OrderData[];
  initialOrderPermissions: OrderPermission[];
  initialBerthings: Berthing[];
};

type PortEventFields = Pick<
  OrderData['berthing'],
  'arrival' | 'shiftings' | 'departure'
>;

const Context = createContext<ContextType | null>(null);

function updatePortEventFields(
  berthing: PortEventFields,
  id: PortEvent['id'],
  changes: PortEventChanges
): PortEventFields {
  return {
    arrival:
      berthing.arrival?.id === id
        ? { ...berthing.arrival, ...changes }
        : berthing.arrival,
    shiftings: berthing.shiftings.map((shifting) =>
      shifting.port_event.id === id
        ? {
            ...shifting,
            port_event: { ...shifting.port_event, ...changes },
          }
        : shifting
    ),
    departure:
      berthing.departure?.id === id
        ? { ...berthing.departure, ...changes }
        : berthing.departure,
  };
}

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

    case 'berthingChanged': {
      const { order: _relatedOrder, ...nestedBerthing } = action.item;

      return {
        ...state,
        berthings: state.berthings.map((berthing) =>
          berthing.id === action.item.id ? action.item : berthing
        ),
        orders: state.orders.map((order) =>
          order.berthing.id === action.item.id
            ? { ...order, berthing: nestedBerthing }
            : order
        ),
      };
    }

    case 'berthingDeleted':
      return {
        ...state,
        berthings: state.berthings.filter(
          (berthing) => berthing.id !== action.id
        ),
      };

    case 'portEventChanged':
      return {
        ...state,
        berthings: state.berthings.map((berthing) => ({
          ...berthing,
          ...updatePortEventFields(berthing, action.id, action.changes),
        })),
        orders: state.orders.map((order) => ({
          ...order,
          berthing: {
            ...order.berthing,
            ...updatePortEventFields(order.berthing, action.id, action.changes),
          },
        })),
      };

    default:
      return state;
  }
}
