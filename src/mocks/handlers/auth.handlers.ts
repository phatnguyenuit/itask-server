import { rest } from 'msw';
import { convertPathToNonStartRegex } from 'utils/common';

export const createLoginSuccessHandler = (
  accessToken: string,
  expiredAt: number,
) =>
  rest.post(convertPathToNonStartRegex('/api/v1/auth/login'), (_, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        data: {
          expiredAt,
          accessToken,
        },
      }),
    );
  });
