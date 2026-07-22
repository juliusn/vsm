import {
  BerthIdentifier,
  PortAreaIdentifier,
  PortEvent,
  PortEventWithDate,
} from '@/lib/types/berthing';
import { Tables, TablesInsert } from '@/lib/types/database.types';
import dayjs from 'dayjs';

export function createEmptyPortEvent(): PortEvent {
  return {
    formKey: `new-${crypto.randomUUID()}`,
    id: null,
    date: null,
    time: null,
    locode: null,
    portAreaCode: null,
    berthCode: null,
    position: null,
  };
}

export function createPortEventFormValue(event: Tables<'port_events'>): PortEvent;
export function createPortEventFormValue(event: null): null;
export function createPortEventFormValue(
  event: Tables<'port_events'> | null
): PortEvent | null;
export function createPortEventFormValue(
  event: Tables<'port_events'> | null
): PortEvent | null {
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
  };
}

export function hasPortEventDate(event: PortEvent): event is PortEventWithDate {
  return typeof event.date === 'string' && event.date.length > 0;
}
