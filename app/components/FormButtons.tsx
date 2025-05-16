'use client';

import { Button } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { MouseEventHandler } from 'react';

interface FormButtonsProps {
  cancelButtonClickHandler: MouseEventHandler<HTMLButtonElement>;
  resetButtonClickHandler: MouseEventHandler<HTMLButtonElement>;
  resetButtonDisabled: boolean;
  submitButtonDisabled: boolean;
  submitButtonLoading: boolean;
}

export function FormButtons({
  cancelButtonClickHandler,
  resetButtonClickHandler,
  resetButtonDisabled,
  submitButtonDisabled,
  submitButtonLoading,
}: FormButtonsProps) {
  const t = useTranslations('FormButtons');
  return (
    <>
      <Button variant="outline" onClick={cancelButtonClickHandler}>
        {t('cancel')}
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
        {t('save')}
      </Button>
    </>
  );
}
