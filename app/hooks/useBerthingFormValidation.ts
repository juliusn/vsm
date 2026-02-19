import { BerthingFormValues } from '@/lib/types/berthing';
import { FormValidateInput, isNotEmpty } from '@mantine/form';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';

export default function useBerthingFormValidation(): FormValidateInput<BerthingFormValues> {
  const t = useTranslations('useBerthingFormValidation');
  const isSevenDigits = (errorMessage: string) => (value: number | null) =>
    value === null || value.toString().length !== 7 ? errorMessage : null;

  return {
    imo: (value) =>
      isNotEmpty(t('imoRequiredError'))(value) ||
      isSevenDigits(t('imoLengthError'))(value),

    arrivalDate: (value, values) => {
      if (!value && values.arrivalTime) return t('enterDateOrRemoveTimeError');

      if (value && values.departureDate) {
        const arrivalDate = dayjs(value);
        const departureDate = dayjs(values.departureDate);
        if (arrivalDate.isAfter(departureDate))
          return t('arrivalDateAfterDepartureDateError');
      }

      return null;
    },

    arrivalTime: (value, values) => {
      if (value && !values.arrivalDate) return t('timeWithoutDateError');

      if (
        value &&
        values.arrivalDate &&
        values.departureDate &&
        values.departureTime
      ) {
        const arrivalDateTime = dayjs(
          `${dayjs(values.arrivalDate).format('YYYY-MM-DD')}T${value}`,
          'YYYY-MM-DDTHH:mm',
          true
        );

        const departureDateTime = dayjs(
          `${dayjs(values.departureDate).format('YYYY-MM-DD')}T${values.departureTime}`,
          'YYYY-MM-DDTHH:mm',
          true
        );

        if (arrivalDateTime.isAfter(departureDateTime))
          return t('etaAfterEtdError');
      }

      return null;
    },

    arrivalLocode: (value, values) =>
      value !== null && values.arrivalDate === null
        ? t('arrivalDateMissingError')
        : null,

    arrivalPortArea: (value, values) =>
      value !== null && values.arrivalDate === null
        ? t('arrivalDateMissingError')
        : null,

    arrivalBerth: (value, values) =>
      value !== null && values.arrivalDate === null
        ? t('arrivalDateMissingError')
        : null,

    departureDate: (value, values) => {
      if (!value && values.departureTime)
        return t('enterDateOrRemoveTimeError');

      if (value && values.arrivalDate) {
        const arrivalDate = dayjs(values.arrivalDate);
        const departureDate = dayjs(value);
        if (departureDate.isBefore(arrivalDate))
          return t('departureDateBeforeArrivalDateError');
      }

      return null;
    },

    departureTime: (value, values) => {
      if (value && !values.departureDate) return t('timeWithoutDateError');

      if (
        value &&
        values.departureDate &&
        values.arrivalDate &&
        values.arrivalTime
      ) {
        const arrivalDateTime = dayjs(
          `${dayjs(values.arrivalDate).format('YYYY-MM-DD')}T${values.arrivalTime}`,
          'YYYY-MM-DDTHH:mm',
          true
        );
        const departureDateTime = dayjs(
          `${dayjs(values.departureDate).format('YYYY-MM-DD')}T${value}`,
          'YYYY-MM-DDTHH:mm',
          true
        );
        if (departureDateTime.isBefore(arrivalDateTime))
          return t('etdBeforeEtaError');
      }

      return null;
    },

    departureLocode: (value, values) =>
      value !== null && values.departureDate === null
        ? t('departureDateMissingError')
        : null,

    departurePortArea: (value, values) =>
      value !== null && values.departureDate === null
        ? t('departureDateMissingError')
        : null,

    departureBerth: (value, values) =>
      value !== null && values.departureDate === null
        ? t('departureDateMissingError')
        : null,
  };
}
