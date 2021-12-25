import { getPagination, paginate } from '../paginate';

describe('utils/paginate', () => {
  describe('getPagination', () => {
    it.each`
      count | page | pageSize | expectedResult
      ${0}  | ${1} | ${5}     | ${{ skip: 0, take: 5, totalPages: 0 }}
      ${5}  | ${1} | ${5}     | ${{ skip: 0, take: 5, totalPages: 1 }}
      ${6}  | ${1} | ${5}     | ${{ skip: 0, take: 5, totalPages: 2 }}
      ${6}  | ${2} | ${5}     | ${{ skip: 5, take: 5, totalPages: 2 }}
    `(
      'should return correct pagination',
      ({ count, page, pageSize, expectedResult }) => {
        expect(getPagination(count, page, pageSize)).toStrictEqual(
          expectedResult,
        );
      },
    );
  });

  describe('paginate', () => {
    const items: string[] = [
      'item 1',
      'item 2',
      'item 3',
      'item 4',
      'item 5',
      'item 6',
      'item 7',
    ];

    it('should return the correct paginated items', () => {
      const result = paginate(items, 1, 5);

      expect(result.totalPages).toBe(2);
      expect(result.items).toStrictEqual([
        'item 1',
        'item 2',
        'item 3',
        'item 4',
        'item 5',
      ]);
    });

    it('should return empty items', () => {
      const result = paginate(items, 3, 5);

      expect(result.items).toStrictEqual([]);
    });
  });
});
