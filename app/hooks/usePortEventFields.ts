'use client';

import {
  BerthIdentifier,
  BerthingFormValues,
  PortAreaIdentifier,
} from '@/lib/types/berthing';
import { useState } from 'react';
import { useBerthingFormContext } from '../context/BerthingFormContext';

type PortEventPath = 'arrival' | 'departure' | `shiftings.${number}`;

function getEvent(
  path: PortEventPath,
  values: Pick<BerthingFormValues, 'arrival' | 'shiftings' | 'departure'>
) {
  if (path === 'arrival') return values.arrival;
  if (path === 'departure') return values.departure;

  const index = Number(path.split('.')[1]);
  return values.shiftings[index];
}

export function usePortEventFields(path: PortEventPath) {
  const datePath = `${path}.date`;
  const timePath = `${path}.time`;
  const locodePath = `${path}.locode`;
  const portAreaPath = `${path}.portAreaCode`;
  const berthPath = `${path}.berthCode`;
  const positionPath = `${path}.position`;
  const form = useBerthingFormContext();
  const initialEvent = getEvent(path, form.getValues());
  const [locode, setLocode] = useState(initialEvent?.locode ?? null);

  const [portAreaCode, setPortAreaCode] = useState(
    initialEvent?.portAreaCode ?? null
  );

  form.watch(locodePath, ({ previousValue, value }) => {
    setLocode(value);

    if (previousValue !== null && previousValue !== value) {
      form.setFieldValue(portAreaPath, null);
      form.setFieldValue(berthPath, null);
    }
  });

  form.watch(portAreaPath, ({ previousValue, value }) => {
    setPortAreaCode(value);

    if (previousValue !== null && previousValue !== value) {
      form.setFieldValue(berthPath, null);
    }

    if (value) {
      const { locode }: PortAreaIdentifier = JSON.parse(value);
      form.setFieldValue(locodePath, locode);
    }
  });

  form.watch(berthPath, ({ value }) => {
    if (!value) return;

    const { locode, port_area_code }: BerthIdentifier = JSON.parse(value);

    const portArea: PortAreaIdentifier = {
      locode,
      port_area_code,
    };

    form.setFieldValue(locodePath, locode);
    form.setFieldValue(portAreaPath, JSON.stringify(portArea));
  });

  return {
    locode,
    portAreaCode,
    paths: {
      date: datePath,
      time: timePath,
      locode: locodePath,
      portArea: portAreaPath,
      berth: berthPath,
      position: positionPath,
    },
  };
}
