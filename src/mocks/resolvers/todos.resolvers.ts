import { Todo } from '@prisma/client';
import { PaginationData } from 'typings/common';
import { createSuccessResolver } from './base.resolvers';

export const createSearchTodosResolver = (data: PaginationData<Todo>) =>
  createSuccessResolver({ data });
