'use client';

import { BerthingFormValues } from '@/lib/types/berthing';
import { OrderFormValues } from '@/lib/types/order';
import { UseFormReturnType } from '@mantine/form/lib/types';
import { createContext, useContext } from 'react';

function createFormContext<T>() {
  const context = createContext<UseFormReturnType<T> | null>(null);
  if (!context) throw `Context not found.`;

  function useFormContext() {
    const form = useContext(context);
    if (!form) throw `Context not found.`;
    return form;
  }

  return [context.Provider, useFormContext] as const;
}

export const [NewOrderFormProvider, useNewOrderFormContext] =
  createFormContext<OrderFormValues>();

export const [EditOrderFormProvider, useEditOrderFormContext] =
  createFormContext<BerthingFormValues & OrderFormValues>();

export const [BerthingFormProvider, useBerthingFormContext] =
  createFormContext<BerthingFormValues>();
