import { encrypt, verify } from '../encryption';

describe('utils/encryption', () => {
  describe('encrypt', () => {
    it('should encrypt plain text', async () => {
      const hash = await encrypt('text');

      expect(hash).toBeTruthy();
    });
  });

  describe('verify', () => {
    const plainText = 'plain text here';

    it.each`
      text                 | expectedResult
      ${''}                | ${false}
      ${'wrong text'}      | ${false}
      ${'Plain text here'} | ${false}
      ${'plain text here'} | ${true}
    `('should return $expectedResult', async ({ text, expectedResult }) => {
      const hash = await encrypt(plainText);
      const isValid = await verify(text, hash);

      expect(isValid).toBe(expectedResult);
    });
  });
});
