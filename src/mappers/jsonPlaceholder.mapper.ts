import { SearchTodoParams as JSONPlaceholderSearchTodoParams } from './../datasources/json-placeholder/jsonPlaceholder.api.types';
import { SearchTodoParams } from 'shared';

export const mapToJSONPlaceholderSearchParams = (
  params: SearchTodoParams = {},
): JSONPlaceholderSearchTodoParams => {
  return Object.fromEntries(
    Object.entries(params).filter(
      ([_, value]) => value !== null || value !== undefined,
    ),
  );
};
