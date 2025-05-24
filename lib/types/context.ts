export type IdObject = { id: string };

export type Action<T extends IdObject> =
  | { type: 'added'; item: T }
  | { type: 'changed'; item: T }
  | { type: 'deleted'; id: T['id'] }
  | { type: 'cascade-deleted'; id: T['id']; foreignKey: keyof T };
