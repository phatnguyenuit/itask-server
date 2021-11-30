import { SearchTodoParams } from 'shared';
import { SearchTodoParams as JSONPlaceholderSearchTodoParams } from 'datasources/json-placeholder/jsonPlaceholder.api.types';

export const mapToJSONPlaceholderSearchParams = (
  params?: SearchTodoParams | null,
): JSONPlaceholderSearchTodoParams => {
  return Object.fromEntries(
    Object.entries(params || {}).filter(
      ([_, value]) => value !== null || value !== undefined,
    ),
  );
};
