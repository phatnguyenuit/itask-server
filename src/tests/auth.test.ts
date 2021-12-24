import supertest from 'supertest';

import app from '../app';
import { mockServer } from 'mocks/server';
import { createLoginSuccessHandler } from 'mocks/handlers/auth.handlers';

const basePath = '/api/v1/auth';

describe(basePath, () => {
  const request = supertest(app);

  describe('/login', () => {
    it('should login successfully', async () => {
      // Mock login success response
      mockServer.use(createLoginSuccessHandler('jwt-token', 1000));

      const response = await request.post(`${basePath}/login`).send({
        email: 'test@local.com',
        password: '123@password',
      });

      expect(response.body).toStrictEqual({
        data: { expiredAt: 1000, accessToken: 'jwt-token' },
      });
    });
  });
});
