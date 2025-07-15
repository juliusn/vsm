'use client';

import { Button } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { MouseEventHandler } from 'react';

interface Props {
  closeButtonClickHandler: MouseEventHandler<HTMLButtonElement>;
  resetButtonClickHandler: MouseEventHandler<HTMLButtonElement>;
  resetButtonDisabled: boolean;
  submitButtonDisabled: boolean;
  submitButtonLoading: boolean;
  submitButtonLabel?: string;
}

export function FormButtons({
  closeButtonClickHandler,
  resetButtonClickHandler,
  resetButtonDisabled,
  submitButtonDisabled,
  submitButtonLoading,
  submitButtonLabel,
}: Props) {
  const t = useTranslations('FormButtons');
  return (
    <>
      <Button variant="outline" onClick={closeButtonClickHandler}>
        {t('close')}
      </Button>
      <Button
        variant="outline"
        onClick={resetButtonClickHandler}
        disabled={resetButtonDisabled}>
        {t('reset')}
      </Button>
      <Button
        type="submit"
        disabled={submitButtonDisabled}
        loading={submitButtonLoading}>
        {submitButtonLabel || t('save')}
      </Button>
    </>
  );
}
