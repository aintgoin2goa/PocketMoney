import {
  amountOwedSelector,
  getLastPayment,
  getPayments,
  lastPaymentSelector,
  nextPaymentSelector,
  paymentHistorySelector,
} from '../../payments/paymentSelectors';
import {getActiveChild, getSettings} from '../../children/childSelectors';
import {makeChild, makeChildSettings, makePayment, makeState} from '../utils';
import {Child, ChildSettings, Payment} from '../../types';
import {format, nextDay, subWeeks, subYears} from 'date-fns';
import {formatDate, formatDistance} from '../../utils';

jest.mock('../../children/childSelectors');

const getActiveChildMock = getActiveChild as jest.Mock<
  ReturnType<typeof getActiveChild>
>;
const getSettingsMock = getSettings as jest.Mock<
  ReturnType<typeof getSettings>
>;

const weeksAgo = (count: number) => subWeeks(new Date(), count);

describe('paymentSelectors', () => {
  let activeChild: Child;
  beforeEach(() => {
    activeChild = makeChild('active-child');
    getActiveChildMock.mockReturnValueOnce(activeChild);
  });
  describe('getPayments', () => {
    it('should return all payments for the current active child in reverse order', () => {
      const payments: Payment[] = [];
      // create 8 payments, with 4 belonging to active child
      for (let i = 0; i < 8; i++) {
        payments.push(
          makePayment(
            `PAYMENT-${i}`,
            i % 2 === 0 ? activeChild.id : 'other-child',
          ),
        );
      }
      const state = makeState({payments});

      const result = getPayments(state);

      expect(result).toHaveLength(4);
      expect(result[0].id).toEqual('PAYMENT-6');
      expect(result[1].id).toEqual('PAYMENT-4');
      expect(result[2].id).toEqual('PAYMENT-2');
      expect(result[3].id).toEqual('PAYMENT-0');
    });

    it('should search the legacy child.payments property as well', () => {
      activeChild.payments.push(makePayment('PAYMENT', activeChild.id));
      const state = makeState({children: [activeChild]});

      const result = getPayments(state);

      expect(result).toHaveLength(1);
      expect(result[0].id).toEqual('PAYMENT');
    });

    it('will return an empty array if no payments are found', () => {
      const payments = [];
      // create 8 payments, none belonging to active child
      for (let i = 0; i < 8; i++) {
        payments.push(makePayment(`PAYMENT-${i}`, 'other-child'));
      }
      const state = makeState({payments});

      const result = getPayments(state);

      expect(result).toHaveLength(0);
    });
  });

  describe('getLastPayment', () => {
    it('should return the first payment returned from getPayments', () => {
      const payments = [];
      for (let i = 0; i < 8; i++) {
        payments.push(makePayment(`PAYMENT-${i}`, activeChild.id));
      }
      const state = makeState({payments});

      const result = getLastPayment(state);

      expect(result).toEqual(payments[7]);
    });
    it('should return undefined if no payments are found', () => {
      const state = makeState();

      const result = getLastPayment(state);

      expect(result).toBeUndefined();
    });
  });
  describe('amountOwedSelector', () => {
    type TestCase = [
      description: string,
      lastPayment: Payment | undefined,
      settings: ChildSettings,
      expected: number,
    ];
    const aYearAgo = subYears(new Date(), 1);
    const pocketMoneyPerWeek = 100;
    const testCases: TestCase[] = [
      [
        'no payments made',
        undefined,
        makeChildSettings({
          beginningOfTime: formatDate(weeksAgo(2)),
          pocketMoneyPerWeek,
        }),
        200,
      ],
      [
        'no payments made, beginning right now',
        undefined,
        makeChildSettings({
          beginningOfTime: formatDate(new Date()),
          pocketMoneyPerWeek,
        }),
        0,
      ],
      [
        'last paid 3 weeks ago',
        makePayment('payment', 'active-child', {
          date: formatDate(weeksAgo(3)),
        }),
        makeChildSettings({
          beginningOfTime: formatDate(aYearAgo),
          pocketMoneyPerWeek,
        }),
        300,
      ],
      [
        'not fully paid last week',
        makePayment('payment', 'active-child', {
          date: formatDate(weeksAgo(1)),
          remaining: 50,
        }),
        makeChildSettings({
          beginningOfTime: formatDate(aYearAgo),
          pocketMoneyPerWeek,
        }),
        150,
      ],
    ];
    test.each(testCases)('%s', (_, lastPayment, settings, expected) => {
      getSettingsMock.mockReturnValueOnce(settings);
      const state = makeState({
        children: [activeChild],
        payments: lastPayment ? [lastPayment] : [],
      });

      const result = amountOwedSelector(state);

      expect(result).toEqual(expected);
    });
  });

  describe('lastPaymentSelector', () => {
    it('should return a properly formatted string', () => {
      const date = weeksAgo(3);
      const expectedDisplayDate = format(date, 'do LLLL');
      const expectedRelativeDate = formatDistance(date);
      const lastPayment = makePayment('payment', 'active-child', {
        date: formatDate(date),
      });
      const state = makeState({
        payments: [lastPayment],
        children: [activeChild],
      });

      const result = lastPaymentSelector(state);

      expect(result).toEqual(
        `${expectedDisplayDate} (${expectedRelativeDate})`,
      );
    });
    it('should handle no payments', () => {
      const state = makeState();

      const result = lastPaymentSelector(state);

      expect(result).toEqual('No payments found');
    });
  });

  describe('nextPaymentSelector', () => {
    it('can display the date as expected', () => {
      const settings = makeChildSettings({payDay: 6});
      getSettingsMock.mockReturnValueOnce(settings);
      const nextPaymentDate = nextDay(new Date(), settings.payDay);
      const expectedDate = format(nextPaymentDate, 'EEEE do LLLL');
      const expectedRelativeDate = formatDistance(nextPaymentDate);
      const state = makeState();

      const result = nextPaymentSelector(state);

      expect(result).toEqual(`${expectedDate} (${expectedRelativeDate})`);
    });
  });

  describe('paymentHistorySelector', () => {
    it('should correctly map payments for display', () => {
      const payments = [];
      const settings = makeChildSettings({payDay: 6});
      getSettingsMock.mockReturnValueOnce(settings);
      const today = new Date();
      for (let i = 0; i < 4; i++) {
        payments.push(
          makePayment(`PAYMENT-${i}`, activeChild.id, {
            date: formatDate(today),
            paid: 100,
          }),
        );
      }
      const state = makeState({payments});

      const result = paymentHistorySelector(state);

      for (let i = 3; i > -1; i--) {
        const index = Math.abs(3 - i);
        const item = result[index];
        expect(item).toEqual({
          index,
          id: `PAYMENT-${i}`,
          key: `PAYMENT-${i}`,
          date: format(today, 'EEEE do LLLL'),
          amount: '£1',
        });
      }
    });
  });
});
