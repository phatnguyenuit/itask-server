export type Validator<TData> = (rawData: unknown) => TData;

export type Nullable<T> = T | null | undefined;

export type NonNullableField<T> = {
  [P in keyof T]: Exclude<T[P], null | undefined>;
};

export type NonNullableDeep<
  TValues extends Record<string, any>,
  K extends keyof TValues = keyof TValues,
> = {
  // use `-?` to remove optional
  [k in K]-?: NonNullable<TValues[k]>;
};

export type PaginationData<TData> = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  data: TData[];
};
