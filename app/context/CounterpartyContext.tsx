'use client';

import { Counterparty } from '@/lib/types/QueryTypes';
import { createContext, useContext } from 'react';

type Props = {
  children: React.ReactNode;
  counterparties: Counterparty[];
};

const Context = createContext<Counterparty[] | null>(null);

export const CounterpartyProvider = ({ children, counterparties }: Props) => {
  return <Context.Provider value={counterparties}>{children}</Context.Provider>;
};

export const useCounterparties = () => {
  const context = useContext(Context);

  if (!context) {
    throw new Error(
      'useCounterparties must be used within CounterpartyProvider.'
    );
  }

  return context;
};
