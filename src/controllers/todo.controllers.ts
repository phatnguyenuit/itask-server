import { RequestHandler, Request } from 'express';
import { Prisma } from '@prisma/client';

import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from 'constants/common';
import { getPagination } from 'utils/paginate';
import prisma from 'utils/prisma';

const queryParamsMapping = (queryParams: Request['query']) => {
  const { userId, id, isCompleted, title, page, pageSize } = queryParams;

  return {
    userId: Boolean(userId) ? Number(userId) : undefined,
    id: Boolean(id) ? Number(id) : undefined,
    title: Boolean(title) ? String(title) : undefined,
    isCompleted: Boolean(isCompleted) ? isCompleted === 'true' : undefined,
    page: Boolean(page) ? Number(page) : undefined,
    pageSize: Boolean(pageSize) ? Number(pageSize) : undefined,
  };
};

export const searchTodos: RequestHandler = async (req, res, next) => {
  try {
    const {
      userId,
      id,
      isCompleted,
      title,
      page = DEFAULT_PAGE,
      pageSize = DEFAULT_PAGE_SIZE,
    } = queryParamsMapping(req.query);

    const whereParams: Prisma.TodoWhereInput = {
      userId,
      id,
      isCompleted,
      title: {
        contains: title,
        mode: 'insensitive',
      },
    };

    const count = await prisma.todo.count({
      where: whereParams,
    });

    if (count === 0) {
      return res.json({
        data: {
          total: count,
          totalPages: 0,
          page,
          pageSize,
          data: [],
        },
      });
    }

    const { skip, take, totalPages } = getPagination(count, page, pageSize);
    const todos = await prisma.todo.findMany({
      where: whereParams,
      skip,
      take,
    });

    return res.json({
      data: {
        total: count,
        totalPages,
        page,
        pageSize,
        data: todos,
      },
    });
  } catch (error) {
    next(error);
  }
};
