'use client';

import {
  dateFormatOptions,
  dateTimeFormatOptions,
  timeFormatOptions,
} from '@/lib/formatOptions';
import { useFormatter, useLocale, useTranslations } from 'next-intl';

export function useSchedule() {
  const locale = useLocale();
  const format = useFormatter();
  const t = useTranslations('useSchedule');

  return {
    getEstimate: (date: string | null, time: string | null) => {
      return date
        ? time
          ? format.dateTime(new Date(`${date}T${time}`), dateTimeFormatOptions)
          : format.dateTime(new Date(date), dateFormatOptions)
        : t('unknown');
    },
    getSchedule: (
      date: string | null,
      time: string | null,
      standby: number,
      duration: number
    ) => {
      if (!date || !time) return t('unknown');
      const dateTime = new Date(`${date}T${time}`);
      const start = new Date(dateTime.getTime() - standby * 60 * 1000);
      const end = new Date(start.getTime() + duration * 60 * 1000);
      return format.dateTimeRange(start, end, timeFormatOptions);
    },
    minutesSuffix:
      new Intl.NumberFormat(locale, {
        style: 'unit',
        unit: 'minute',
        unitDisplay: 'short',
      })
        .formatToParts(0)
        .find((part) => part.type === 'unit')?.value ?? 'min',
  };
}
