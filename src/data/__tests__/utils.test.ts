import {addDays} from 'date-fns';
import {CurrencySymbol} from '../types';
import {
  formatDate,
  formatDistance,
  parseDate,
  printCurrency,
  splitCurrencyAmount,
} from '../utils';

describe('data/utils', () => {
  describe('splitCurrencyAmount', () => {
    type TestCase = [[number, number], number | undefined];
    const testCases: TestCase[] = [
      [[0, 0], undefined],
      [[1, 0], 100],
      [[1, 50], 150],
      [[10, 50], 1050],
      [[9, 99], 999],
      [[0, 15], 15],
    ];
    test.each(testCases)(
      'should return %s if input = %s',
      (expected, input) => {
        const output = splitCurrencyAmount(input);
        expect(output).toEqual(expected);
      },
    );
  });

  describe('printCurrency', () => {
    const CURRENCY_POUNDS = {major: '£', minor: 'p'};
    const CURRENCY_EUROS = {major: '€', minor: 'c'};

    type TestCase = [number, CurrencySymbol, string];
    const testCases: TestCase[] = [
      [0, CURRENCY_POUNDS, '0'],
      [0, CURRENCY_EUROS, '0'],
      [50, CURRENCY_POUNDS, '50p'],
      [35, CURRENCY_EUROS, '35c'],
      [100, CURRENCY_POUNDS, '£1'],
      [100, CURRENCY_EUROS, '€1'],
      [180, CURRENCY_POUNDS, '£1.80'],
      [1040, CURRENCY_EUROS, '€10.40'],
    ];
    test.each(testCases)(
      'if amount = %s and currency = %s it should return %s',
      (amount, currency, expected) => {
        const output = printCurrency(amount, currency);
        expect(output).toEqual(expected);
      },
    );
  });

  describe('parseDate', () => {
    it('can parse a date in the correct format', () => {
      const date = '2020-02-02';
      const expected = new Date(2020, 1, 2);
      const actual = parseDate(date);
      expect(actual).toEqual(expected);
    });
    it('should throw if it is not in the correct format', () => {
      const invalidDate = '2nd Feb 2020';
      expect(() => parseDate(invalidDate)).toThrow(
        `Invalid date: ${invalidDate}`,
      );
    });
  });

  describe('formatDate', () => {
    type TestCase = [Date, string];
    const testCases: TestCase[] = [[new Date(2020, 1, 2), '2020-02-02']];
    test.each(testCases)('it formats %s as expected', (input, expected) => {
      expect(formatDate(input)).toEqual(expected);
    });
  });

  describe('formatDistance', () => {
    type TestCase = [Date, string];
    const testCases: TestCase[] = [
      [new Date(), 'today'],
      [addDays(new Date(), 1), 'tomorrow'],
      [addDays(new Date(), -1), 'yesterday'],
      [addDays(new Date(), -5), '5 days ago'],
      [addDays(new Date(), 5), 'in 5 days'],
    ];
    test.each(testCases)(
      'it reports the distance from %s as %s',
      (date1, expected) => {
        expect(formatDistance(date1)).toEqual(expected);
      },
    );
  });
});
