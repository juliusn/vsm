'use client';

import {
  BerthingFormValues,
  BerthingSubmitValues,
} from '@/lib/types/berthing-form-types';
import { createFormContext } from '@mantine/form';

type BerthingTransform = (values: BerthingFormValues) => BerthingSubmitValues;

export const [BerthingFormProvider, useBerthingFormContext, useBerthingForm] =
  createFormContext<BerthingFormValues, BerthingTransform>();
