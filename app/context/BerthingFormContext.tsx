'use client';

import { BerthingFormValues } from '@/lib/types/berthing';
import { createFormContext } from '@mantine/form';

export const [BerthingFormProvider, useBerthingFormContext, useBerthingForm] =
  createFormContext<BerthingFormValues>();
