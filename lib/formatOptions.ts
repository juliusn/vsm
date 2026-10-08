import { DateTimeFormatOptions } from 'next-intl';

export const dateTimeFormatOptions: DateTimeFormatOptions = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
};

export const dateFormatOptions: DateTimeFormatOptions = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
};

export const timeFormatOptions: DateTimeFormatOptions = {
  hour: 'numeric',
  minute: 'numeric',
};
