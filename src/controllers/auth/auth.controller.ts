import { RequestHandler } from 'express';
import JWT from 'jsonwebtoken';

import APIError from 'constants/APIError';
import { INVALID_AUTHENTICATION_ERROR } from 'constants/errors';
import { generateToken } from 'utils/auth';
import { validateRawData } from 'utils/common';
import * as encryption from 'utils/encryption';
import logger from 'utils/logger';
import prisma from 'utils/prisma';

import { validate } from './auth.controller.types.validator';

export const login: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = validateRawData(
      validate('LoginInput'),
      req.body,
    );

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return next(INVALID_AUTHENTICATION_ERROR);
    }

    const isMatchedPassword = await encryption.verify(password, user.password);
    if (!isMatchedPassword) {
      return next(INVALID_AUTHENTICATION_ERROR);
    }

    const data = {
      userId: user.id,
      email: user.email,
      name: user.name,
    };

    const token = await generateToken(data);
    // Decode token to get exp
    const decodedToken = JWT.decode(token!, { complete: true });

    res.json({
      data: {
        expiredAt: decodedToken?.payload?.exp,
        accessToken: token,
      },
    });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

export const changePassword: RequestHandler = async (req, res, next) => {
  try {
    const { email, currentPassword, newPassword, rePassword } = validateRawData(
      validate('ChangePasswordInput'),
      req.body,
    );

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return next(INVALID_AUTHENTICATION_ERROR);
    }

    const isMatchedPassword = await encryption.verify(
      currentPassword,
      user.password,
    );

    if (!isMatchedPassword) {
      return next(INVALID_AUTHENTICATION_ERROR);
    }

    if (newPassword !== rePassword) {
      return next(new APIError('New passwords are not matched.', 400));
    }

    const hashPassword = await encryption.encrypt(newPassword);

    await prisma.user.update({
      data: {
        password: hashPassword,
      },
      where: {
        email,
      },
    });

    return res.json({
      message: 'Request successfully.',
    });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

export const signup: RequestHandler = async (req, res, next) => {
  try {
    const { name, email, password, rePassword } = validateRawData(
      validate('SignupInput'),
      req.body,
    );

    if (password !== rePassword) {
      return next(new APIError('Passwords are not matched.', 400));
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (user) {
      return next(new APIError('User is existed.', 400));
    }

    const hashPassword = await encryption.encrypt(password);

    await prisma.user.create({
      data: {
        email,
        name,
        password: hashPassword,
      },
    });

    return res.json({
      message: 'Request successfully.',
    });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};
