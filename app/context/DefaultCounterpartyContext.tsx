'use client';

import { Counterparty } from '@/lib/types/query-types';
import { WithDictionary } from '@/lib/types/translation';
import { createContext, useContext } from 'react';

type Props = {
  children: React.ReactNode;
  sender: WithDictionary<Counterparty>;
  receiver: WithDictionary<Counterparty>;
};

const Context = createContext<{
  sender: WithDictionary<Counterparty>;
  receiver: WithDictionary<Counterparty>;
} | null>(null);

export const DefaultCounterpartyProvider = ({
  children,
  sender,
  receiver,
}: Props) => {
  return (
    <Context.Provider value={{ sender, receiver }}>{children}</Context.Provider>
  );
};

export const useDefaultCounterparties = () => {
  const context = useContext(Context);

  if (!context) {
    throw new Error(
      'useDefaultCounterparties must be used within DefaultCounterpartyProvider.'
    );
  }

  return context;
};
