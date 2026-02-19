'use client';

import { createFormContext } from '@mantine/form';

type FormValues = {
  sender_counterparty_business_id: string | null;
  receiver_counterparty_business_id: string | null;
  berthing: string | null;
  services: string[];
};

type Transform = (values: FormValues) => {
  sender_counterparty_business_id: string;
  receiver_counterparty_business_id: string;
  berthing: string;
  services: string[];
};

export const [OrderFormProvider, useOrderFormContext, useOrderForm] =
  createFormContext<FormValues, Transform>();
