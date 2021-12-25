import supertest from 'supertest';

import app from 'app';
import {
  changePasswordSuccessHandler,
  createLoginSuccessHandler,
  signupSuccessHandler,
} from 'mocks/handlers/auth.handlers';
import { mockServer } from 'mocks/server';

describe('api/v1/auth', () => {
  const request = supertest(app);

  describe('login', () => {
    it('should login successfully', async () => {
      // Mock login success response
      mockServer.use(createLoginSuccessHandler('jwt-token', 1000));

      const response = await request.post('/api/v1/auth/login').send({
        email: 'test@local.com',
        password: '123@password',
      });

      expect(response.body).toStrictEqual({
        data: { expiredAt: 1000, accessToken: 'jwt-token' },
      });
    });
  });

  describe('change-password', () => {
    it('should change password successfully', async () => {
      // Mock change password success response handler
      mockServer.use(changePasswordSuccessHandler);

      const response = await request.post('/api/v1/auth/change-password').send({
        email: 'test@local.com',
        currentPassword: '123@password',
        newPassword: '123@password-new',
        rePassword: '123@password-new',
      });

      expect(response.body).toStrictEqual({
        message: 'Request successfully.',
      });
    });
  });

  describe('signup', () => {
    it('should signup successfully', async () => {
      // Mock signup success response handler
      mockServer.use(signupSuccessHandler);

      const response = await request.post('/api/v1/auth/signup').send({
        name: 'test',
        email: 'test@local.com',
        password: '123@password',
        rePassword: '123@password',
      });

      expect(response.body).toStrictEqual({
        message: 'Request successfully.',
      });
    });
  });
});
