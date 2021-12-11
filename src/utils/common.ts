import { NonNullableDeep, Nullable, Validator } from '../typings/common';

export function validateRawData<TData>(
  validator: Validator<TData>,
  rawData: unknown,
): TData {
  try {
    return validator(rawData);
  } catch (error: any) {
    throw error;
  }
}

export const removeNullableProperties = <TValues>(
  values?: Nullable<TValues>,
) => {
  return Object.fromEntries(
    Object.entries(values || {}).filter(
      ([_, value]) => value !== null && value !== undefined,
    ),
  ) as Partial<NonNullableDeep<TValues>>;
};
