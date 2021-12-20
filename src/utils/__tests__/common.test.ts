import { removeNullableProperties } from '../common';

describe('utils/common', () => {
  describe('removeNullableProperties', () => {
    it.each`
      actualInput                                             | expectedResult
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
});
