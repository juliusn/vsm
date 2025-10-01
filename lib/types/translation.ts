import { Enums, Tables } from './database.types';
import { BerthService, CommonService, Counterparty } from './query-types';

type AbbreviationRow =
  | Tables<'common_service_translations'>
  | Tables<'berth_service_translations'>;

export type RowWithTranslations = CommonService | BerthService | Counterparty;

export type TranslationRow<T extends RowWithTranslations> =
  T['translations'][number];

export type TranslationWithAbbreviation = Pick<
  Omit<AbbreviationRow, 'common_service' | 'berth_service'>,
  'locale' | 'title' | 'abbreviation'
>;

export type Dictionary<T extends RowWithTranslations> = {
  [L in Enums<'locale'>]: TranslationRow<T>;
};

export type WithDictionary<T extends RowWithTranslations> = Omit<
  T,
  'translations'
> & {
  dictionary: Dictionary<T>;
};
