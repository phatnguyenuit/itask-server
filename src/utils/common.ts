import { NonNullableDeep, Nullable } from 'typings/common';

export const removeNullableProperties = <TValues>(
  values?: Nullable<TValues>,
) => {
  return Object.fromEntries(
    Object.entries(values || {}).filter(
      ([_, value]) => value !== null && value !== undefined,
    ),
  ) as Partial<NonNullableDeep<TValues>>;
};
