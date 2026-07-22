import { BerthingFormValues, PortEvent } from '@/lib/types/berthing';
import { FormErrors, FormValidateInput, isNotEmpty } from '@mantine/form';
import { useTranslations } from 'next-intl';

type PortEventInSequence = {
  event: PortEvent;
  path: string;
};

function isAfter(previous: PortEvent, next: PortEvent) {
  if (!previous.date || !next.date) return false;

  if (previous.date !== next.date) {
    return previous.date > next.date;
  }

  return Boolean(
    previous.time && next.time && previous.time > next.time
  );
}

export function useBerthingChronologyValidation() {
  const t = useTranslations('useBerthingFormValidation');

  return (values: BerthingFormValues): FormErrors => {
    const events: PortEventInSequence[] = [];

    if (values.arrival) {
      events.push({ event: values.arrival, path: 'arrival' });
    }

    values.shiftings.forEach((event, index) => {
      events.push({ event, path: `shiftings.${index}` });
    });

    if (values.departure) {
      events.push({ event: values.departure, path: 'departure' });
    }

    return events.slice(1).reduce<FormErrors>((errors, current, index) => {
      const previous = events[index];

      if (isAfter(previous.event, current.event)) {
        errors[`${current.path}.date`] = t('portEventChronologyError');
      }

      return errors;
    }, {});
  };
}

export default function useBerthingFormValidation(): FormValidateInput<BerthingFormValues> {
  const t = useTranslations('useBerthingFormValidation');
  const isSevenDigits = (errorMessage: string) => (value: number | null) =>
    value === null || value.toString().length !== 7 ? errorMessage : null;

  return {
    imo: (value) =>
      isNotEmpty(t('imoRequiredError'))(value) ||
      isSevenDigits(t('imoLengthError'))(value),

    arrival: {
      date: (value) => (!value ? t('portEventDateRequiredError') : null),

      time: (value, values) => {
        if (value && !values.arrival?.date) return t('timeWithoutDateError');
        return null;
      },

      locode: (value, values) =>
        value !== null && values.arrival?.date === null
          ? t('arrivalDateMissingError')
          : null,

      portAreaCode: (value, values) =>
        value !== null && values.arrival?.date === null
          ? t('arrivalDateMissingError')
          : null,

      berthCode: (value, values) =>
        value !== null && values.arrival?.date === null
          ? t('arrivalDateMissingError')
          : null,
    },

    shiftings: {
      date: (value) => (!value ? t('portEventDateRequiredError') : null),
    },

    departure: {
      date: (value) => (!value ? t('portEventDateRequiredError') : null),

      time: (value, values) => {
        if (value && !values.departure?.date) return t('timeWithoutDateError');
        return null;
      },

      locode: (value, values) =>
        value !== null && values.departure?.date === null
          ? t('departureDateMissingError')
          : null,

      portAreaCode: (value, values) =>
        value !== null && values.departure?.date === null
          ? t('departureDateMissingError')
          : null,

      berthCode: (value, values) =>
        value !== null && values.departure?.date === null
          ? t('departureDateMissingError')
          : null,
    },
  };
}
