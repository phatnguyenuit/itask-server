import { NonNullableDeep, Nullable, Validator } from 'typings/common';

export const validateRawData = <TData>(
  validator: Validator<TData>,
  rawData: unknown,
): TData => validator(rawData);

export const removeNullableProperties = <TValues>(
  values?: Nullable<TValues>,
) => {
  return Object.fromEntries(
    Object.entries(values || {}).filter(
      ([_, value]) => value !== null && value !== undefined,
    ),
  ) as Partial<NonNullableDeep<TValues>>;
};
