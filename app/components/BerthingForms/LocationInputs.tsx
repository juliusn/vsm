import { useLocations } from '@/app/context/LocationContext';
import { getLocationInputItems } from '@/lib/getLocationInputItems';
import { Button, Collapse, Flex, Stack } from '@mantine/core';
import { GetInputPropsReturnType } from '@mantine/form/lib/types';
import { useDisclosure } from '@mantine/hooks';
import { IconCaretDownFilled, IconCaretRightFilled } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { BerthInput } from './BerthInput';
import { LocodeInput } from './LocodeInput';
import { PortAreaInput } from './PortAreaInput';

interface Props {
  locode: string | null;
  portArea: string | null;
  locodeInputProps: GetInputPropsReturnType;
  locodeInputKey: string;
  portAreaInputProps: GetInputPropsReturnType;
  portAreaInputKey: string;
  berthInputProps: GetInputPropsReturnType;
  berthInputKey: string;
}

export function LocationInputs({
  locode,
  portArea,
  locodeInputProps,
  locodeInputKey,
  portAreaInputProps,
  portAreaInputKey,
  berthInputProps,
  berthInputKey,
}: Props) {
  const t = useTranslations('LocationInputs');
  const [opened, { toggle }] = useDisclosure(false);

  const {
    state: { locations, portAreas, berths },
  } = useLocations();

  const { portAreaItems, berthsItems } = useMemo(
    () => getLocationInputItems(locations, portAreas, berths, locode, portArea),
    [locations, portAreas, berths, locode, portArea]
  );

  return (
    <>
      <Flex>
        <Button
          size="compact-sm"
          variant="transparent"
          onClick={toggle}
          leftSection={
            opened ? (
              <IconCaretDownFilled size={14} />
            ) : (
              <IconCaretRightFilled size={14} />
            )
          }>
          {t('locationAndPortArea')}
        </Button>
      </Flex>
      <Collapse in={opened} component={Stack}>
        <LocodeInput
          locations={locations}
          {...locodeInputProps}
          key={locodeInputKey}
        />
        <PortAreaInput
          data={portAreaItems}
          {...portAreaInputProps}
          key={portAreaInputKey}
        />
      </Collapse>
      <BerthInput data={berthsItems} {...berthInputProps} key={berthInputKey} />
    </>
  );
}
