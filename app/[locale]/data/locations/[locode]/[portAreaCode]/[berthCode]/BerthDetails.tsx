'use client';

import { notFound } from 'next/navigation';
import { useLocation } from '../../LocationContext';

export default function BerthDetails({
  locode,
  portAreaCode,
  berthCode,
}: {
  locode: string;
  portAreaCode: string;
  berthCode: string;
}) {
  const { state } = useLocation();
  const berth = state.berths.find(
    (berth) =>
      berth.locode === locode &&
      berth.port_area_code === portAreaCode &&
      berth.berth_code === berthCode
  );
  if (!berth) {
    notFound();
  }
  return berth.berth_name;
}
