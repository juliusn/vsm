'use client';
import { Select } from '@mantine/core';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next-intl/client';

export function LanguageSelect() {
  const locale = useLocale();
  const router = useRouter();
  const pathName = usePathname();
  return (
    <Select
      size="xs"
      defaultValue={locale}
      onChange={(value) => value && router.replace(pathName, { locale: value })}
      allowDeselect={false}
      className="w-20"
      data={[
        { label: '🇬🇧 En', value: 'en' },
        { label: '🇫🇮 Fi', value: 'fi' },
      ]}
    />
  );
}
