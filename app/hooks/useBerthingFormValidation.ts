import { BerthingFormValues } from '@/lib/types/berthing';
import { FormValidateInput, isNotEmpty } from '@mantine/form';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';

export default function useBerthingFormValidation(): FormValidateInput<BerthingFormValues> {
  const t = useTranslations('BerthingFormFields');
  const isSevenDigits = (errorMessage: string) => (value: number | '') =>
    value.toString().length !== 7 ? errorMessage : null;

  return {
    imo: (value) =>
      isNotEmpty(t('imoRequiredError'))(value) ??
      isSevenDigits(t('imoLengthError'))(value),

    etaDate: (value, values) => {
      if (!value && values.etaTime) return t('enterDateOrRemoveTimeError');

      if (value && values.etdDate) {
        const etaDate = dayjs(value);
        const etdDate = dayjs(values.etdDate);
        if (etaDate.isAfter(etdDate)) return t('etaDateAfterEtdDateError');
      }

      return null;
    },

    etaTime: (value, values) => {
      if (value && !values.etaDate) return t('timeWithoutDateError');

      if (value && values.etaDate && values.etdDate && values.etdTime) {
        const etaDateTime = dayjs(
          `${dayjs(values.etaDate).format('YYYY-MM-DD')}T${value}`,
          'YYYY-MM-DDTHH:mm',
          true
        );

        const etdDateTime = dayjs(
          `${dayjs(values.etdDate).format('YYYY-MM-DD')}T${values.etdTime}`,
          'YYYY-MM-DDTHH:mm',
          true
        );

        if (etaDateTime.isAfter(etdDateTime)) return t('etaAfterEtdError');
      }

      return null;
    },

    etdDate: (value, values) => {
      if (!value && values.etdTime) return t('enterDateOrRemoveTimeError');

      if (value && values.etaDate) {
        const etaDate = dayjs(values.etaDate);
        const etdDate = dayjs(value);
        if (etdDate.isBefore(etaDate)) return t('etdDateBeforeEtaDateError');
      }

      return null;
    },

    etdTime: (value, values) => {
      if (value && !values.etdDate) return t('timeWithoutDateError');

      if (value && values.etdDate && values.etaDate && values.etaTime) {
        const etaDateTime = dayjs(
          `${dayjs(values.etaDate).format('YYYY-MM-DD')}T${values.etaTime}`,
          'YYYY-MM-DDTHH:mm',
          true
        );
        const etdDateTime = dayjs(
          `${dayjs(values.etdDate).format('YYYY-MM-DD')}T${value}`,
          'YYYY-MM-DDTHH:mm',
          true
        );
        if (etdDateTime.isBefore(etaDateTime)) return t('etdBeforeEtaError');
      }

      return null;
    },
  };
}
