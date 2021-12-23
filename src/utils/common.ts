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

export const getEnv = (name: string, defaultValue?: string) => {
  const value = process.env[name] || defaultValue;

  if (!value) {
    throw new Error(`Environment variable named "${name}" is not defined.`);
  }

  return value;
};
