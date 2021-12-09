import { Prisma } from '@prisma/client';
import { RequestHandler, Request } from 'express';

import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from 'constants/common';
import APIError from 'constants/APIError';
import { RECORD_NOT_FOUND } from 'constants/errors';
import { getPagination } from 'utils/paginate';
import prisma from 'utils/prisma';

import { validate } from './todo.controller.types.validator';
import { validateRawData } from 'utils/common';

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
          page,
          pageSize,
          total: count,
          totalPages: 0,
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

export const createTodo: RequestHandler = async (req, res, next) => {
  try {
    console.log("validate('CreateTodoInput')", validate('CreateTodoInput'));
    const data = validateRawData(validate('CreateTodoInput'), req.body);

    console.log(`data`, data);

    const existingUser = await prisma.user.findUnique({
      where: {
        id: data.userId,
      },
    });

    if (!existingUser) {
      throw new APIError('User is not found', 404);
    }

    const todo = await prisma.todo.create({
      data,
    });

    return res.json(todo);
  } catch (error) {
    next(error);
  }
};

type TodoIdPathParams = {
  id: string;
};

export const verifyTodoId: RequestHandler<TodoIdPathParams> = async (
  req,
  res,
  next,
) => {
  const id = Number(req.params.id);

  if (!id) {
    return next(new APIError('Wrong ID provided.', 400));
  }

  const existingTodo = await prisma.todo.findUnique({
    where: { id },
  });

  if (!existingTodo) {
    return next(RECORD_NOT_FOUND);
  }

  next();
};

export const updateTodo: RequestHandler<TodoIdPathParams> = async (
  req,
  res,
  next,
) => {
  try {
    const id = Number(req.params.id);

    const { title, isCompleted } = req.body;

    const todo = await prisma.todo.update({
      data: {
        title,
        isCompleted,
      },
      where: { id },
    });

    return res.json(todo);
  } catch (error) {
    next(error);
  }
};

export const getTodo: RequestHandler<TodoIdPathParams> = async (
  req,
  res,
  next,
) => {
  try {
    const id = Number(req.params.id);
    const existingTodo = await prisma.todo.findUnique({
      where: { id },
    });

    return res.json(existingTodo);
  } catch (error) {
    next(error);
  }
};

export const deleteTodo: RequestHandler<TodoIdPathParams> = async (
  req,
  res,
  next,
) => {
  try {
    const id = Number(req.params.id);

    await prisma.todo.delete({
      where: { id },
    });

    return res.json({
      message: 'Request successfully.',
    });
  } catch (error) {
    next(error);
  }
};
