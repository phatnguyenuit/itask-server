export const getPagination = (
  count: number,
  page: number,
  pageSize: number,
) => {
  const totalPages = Math.ceil(count / pageSize);
  const skip = (page - 1) * pageSize;

  return {
    skip,
    take: pageSize,
    totalPages,
  };
};

export const paginate = <TItem>(
  items: TItem[],
  page: number,
  pageSize: number,
) => {
  const total = items.length;
  const totalPages = Math.ceil(total / pageSize);

  const fromIndex = (page - 1) * pageSize;
  const toIndex = page * pageSize;
  const pageItems = items.slice(fromIndex, toIndex);

  return {
    total,
    totalPages,
    page,
    pageSize,
    items: pageItems,
  };
};
