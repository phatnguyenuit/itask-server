import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';

import { mockServer } from './mocks/server';
import prisma from './utils/prisma';

// Mock prisma singleton instance
jest.mock('./utils/prisma', () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}));

// reset prismaMock before each test
beforeEach(() => {
  mockReset(prismaMock);
});

// Setting up mock server with MSW

// Establish API mocking before all tests.
beforeAll(() => mockServer.listen());

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => mockServer.resetHandlers());

// Clean up after the tests are finished.
afterAll(() => mockServer.close());

// Export prismaMock to use in each test file
export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
