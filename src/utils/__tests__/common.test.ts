import { Validator } from 'typings/common';
import { removeNullableProperties, validateRawData } from '../common';

describe('utils/common', () => {
  describe('removeNullableProperties', () => {
    it.each`
      actualInput                                             | expectedResult
      ${undefined}                                            | ${{}}
      ${null}                                                 | ${{}}
      ${{}}                                                   | ${{}}
      ${{ a: 10 }}                                            | ${{ a: 10 }}
      ${{ a: 10, b: null, c: undefined }}                     | ${{ a: 10 }}
      ${{ a: 10, b: null, c: undefined, d: true, e: false }}  | ${{ a: 10, d: true, e: false }}
      ${{ a: 10, b: null, c: undefined, d: 'string', e: '' }} | ${{ a: 10, d: 'string', e: '' }}
    `(
      'should remove nullable properties',
      ({ actualInput, expectedResult }) => {
        expect(removeNullableProperties(actualInput)).toStrictEqual(
          expectedResult,
        );
      },
    );
  });

  describe('validateRawData', () => {
    type TestData = {
      requiredProperty: number;
      optionalProperty?: boolean;
    };

    const validatorMock = jest.fn();

    it('should return validated data', () => {
      const data: unknown = { requiredProperty: 1 };
      validatorMock.mockReturnValue({ requiredProperty: 1 });

      expect(
        validateRawData(validatorMock as Validator<TestData>, data),
      ).toEqual(data);
    });

    it('should throw error in case conflicted', () => {
      const data: unknown = { requiredProperty: null };
      const error = new Error('Fail to parse.');
      validatorMock.mockRejectedValue(error);

      expect(
        validateRawData(validatorMock as Validator<TestData>, data),
      ).rejects.toBe(error);
    });
  });
});
