import { Action, IdObject } from './types/context';

export function reducer<T extends IdObject>(
  items: T[],
  action: Action<T>
): T[] {
  switch (action.type) {
    case 'added': {
      return [...items, action.item];
    }
    case 'changed': {
      return items.map((item) =>
        item.id === action.item.id ? action.item : item
      );
    }
    case 'deleted': {
      return items.filter((item) => item.id !== action.id);
    }
    case 'cascade-deleted': {
      return items.filter((item) => item[action.foreignKey] !== action.id);
    }
  }
}
