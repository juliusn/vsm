import { SortableCommonService } from '@/app/context/CommonServiceContext';
import { OrderData } from './types/order';
import { Order } from './types/query-types';
import { RowWithTranslations, WithDictionary } from './types/translation';

export function normalizeRow<T extends RowWithTranslations>(
  row: T
): WithDictionary<T> | null {
  const en = row.translations.find((t) => t.locale === 'en');
  const fi = row.translations.find((t) => t.locale === 'fi');

  if (!en || !fi) return null;

  const { translations: _omit, ...rest } = row;

  return { ...rest, dictionary: { en, fi } };
}

export function normalizeTranslations<T extends RowWithTranslations>(
  data: T[]
): WithDictionary<T>[] {
  return data.reduce<WithDictionary<T>[]>((array, row) => {
    const normalized = normalizeRow(row);

    if (!normalized) return array;

    array.push(normalized);

    return array;
  }, []);
}

export function normalizeOrder(order: Order): OrderData | null {
  const sender = normalizeRow(order.sender);
  const receiver = normalizeRow(order.receiver);
  const sortableCommonServices = normalizeSortables(order.common_services);

  if (!sender || !receiver) return null;

  return {
    ...order,
    common_services: normalizeTranslations<SortableCommonService>(
      sortableCommonServices
    ),
    sender,
    receiver,
  };
}

export function normalizeOrders(orders: Order[]): OrderData[] {
  return orders.reduce<OrderData[]>((array, row) => {
    const order = normalizeOrder(row);

    if (!order) return array;

    array.push(order);

    return array;
  }, []);
}

type MaybeSortable = { sort_order: number | null };
type Sortable = { sort_order: number };
type ReturnType<T extends MaybeSortable> = Omit<T, 'sort_order'> & Sortable;

export function normalizeSortables<T extends MaybeSortable>(
  sortables: T[]
): ReturnType<T>[] {
  return sortables.flatMap((sortable) =>
    sortable.sort_order !== null ? [sortable as ReturnType<T>] : []
  );
}
