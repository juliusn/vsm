import { OrderData } from './types/order';
import { CommonService, Order } from './types/query-types';
import { RowWithTranslations, WithDictionary } from './types/translation';

function normalizeRow<T extends RowWithTranslations>(
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

  if (!sender || !receiver) return null;

  return {
    ...order,
    common_services: normalizeTranslations<CommonService>(
      order.common_services
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
