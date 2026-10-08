import {
  BerthIdentifier,
  PortAreaIdentifier,
  PortEventFormValues,
  PortEventWithDate,
} from '@/lib/types/berthing-form-types';
import { Tables, TablesInsert } from '@/lib/types/database.types';
import dayjs from 'dayjs';

const emptyPortEventSharedValues: Omit<
  PortEventFormValues,
  'formKey' | 'max_assignees'
> = {
  id: null,
  date: null,
  time: null,
  locode: null,
  portAreaCode: null,
  berthCode: null,
  position: null,
  default_standby_minutes: 30,
  default_duration_minutes: 120,
  is_public: false,
};

export const createEmptyArrival = (): PortEventFormValues => ({
  ...emptyPortEventSharedValues,
  formKey: `new-${crypto.randomUUID()}`,
  max_assignees: 3,
});

export const createEmptyDeparture = (): PortEventFormValues => ({
  ...emptyPortEventSharedValues,
  formKey: `new-${crypto.randomUUID()}`,
  max_assignees: 2,
});

export const createEmptyShifting = (): PortEventFormValues => ({
  ...emptyPortEventSharedValues,
  formKey: `new-${crypto.randomUUID()}`,
  max_assignees: 3,
});

export function createPortEventFormValue(
  event: Tables<'port_events'>
): PortEventFormValues;

export function createPortEventFormValue(event: null): null;

export function createPortEventFormValue(
  event: Tables<'port_events'> | null
): PortEventFormValues | null;

export function createPortEventFormValue(
  event: Tables<'port_events'> | null
): PortEventFormValues | null {
  if (!event) return null;

  const portArea: PortAreaIdentifier | null =
    event.locode && event.port_area_code
      ? { locode: event.locode, port_area_code: event.port_area_code }
      : null;

  const berth: BerthIdentifier | null =
    event.locode && event.port_area_code && event.berth_code
      ? {
          locode: event.locode,
          port_area_code: event.port_area_code,
          berth_code: event.berth_code,
        }
      : null;

  return {
    formKey: event.id,
    id: event.id,
    date: event.estimated_date,
    time: event.estimated_time?.slice(0, 5) ?? null,
    locode: event.locode,
    portAreaCode: portArea ? JSON.stringify(portArea) : null,
    berthCode: berth ? JSON.stringify(berth) : null,
    position: event.position,
    default_standby_minutes: event.default_standby_minutes,
    default_duration_minutes: event.default_duration_minutes,
    max_assignees: event.max_assignees,
    is_public: event.is_public,
  };
}

export function createPortEventInsert(
  event: PortEventWithDate,
  type: TablesInsert<'port_events'>['type']
): TablesInsert<'port_events'> {
  const portArea = event.portAreaCode
    ? (JSON.parse(event.portAreaCode) as PortAreaIdentifier)
    : null;

  const berth = event.berthCode
    ? (JSON.parse(event.berthCode) as BerthIdentifier)
    : null;

  return {
    type,
    estimated_date: dayjs(event.date).format('YYYY-MM-DD'),
    estimated_time: event.time,
    locode: berth?.locode ?? portArea?.locode ?? event.locode,
    port_area_code: berth?.port_area_code ?? portArea?.port_area_code ?? null,
    berth_code: berth?.berth_code ?? null,
    position: event.position,
    default_standby_minutes: event.default_standby_minutes,
    default_duration_minutes: event.default_duration_minutes,
    max_assignees: event.max_assignees,
    is_public: event.is_public,
  };
}

export function hasPortEventDate(
  event: PortEventFormValues
): event is PortEventWithDate {
  return typeof event.date === 'string' && event.date.length > 0;
}
