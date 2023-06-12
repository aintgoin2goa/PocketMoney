import {Payment} from '../../types';
import {makePayment as createPayment, makePayment} from '../utils';
import {paymentsSlice} from '../../payments/paymentReducer';

jest.spyOn(console, 'error').mockImplementation();

describe('paymentReducer', () => {
  describe('makePayment', () => {
    type TestCase = [
      description: string,
      payment: Partial<Payment> | any,
      isValid: boolean,
    ];
    const paymentWithoutChildId: Partial<Payment> = makePayment('id');
    delete paymentWithoutChildId.childId;
    const testCases: TestCase[] = [
      ['valid payment', createPayment('id', 'childId'), true],
      ['missing payment', undefined, false],
      ['payment not an object', 'payment', false],
      ['payment missing childId', paymentWithoutChildId, false],
      ['empty childId', makePayment('id', ''), false],
    ];

    describe.each(testCases)('%s', (_, payment, isValid) => {
      const action = paymentsSlice.actions.makePayment(payment as Payment);
      const state: Payment[] = [];
      const result = paymentsSlice.reducer(state, action);
      if (isValid) {
        it('should add payment', () => {
          expect(result).toHaveLength(1);
          expect(result).toContain(payment);
        });
      } else {
        it('should not add payment', () => {
          expect(result).toHaveLength(0);
          expect(result).not.toContain(payment);
        });
      }
    });
  });

  describe('deletePayment', () => {
    it('should remove the given payment from the list', () => {
      const payments: Payment[] = [
        makePayment('1'),
        makePayment('2'),
        makePayment('3'),
      ];

      const action = paymentsSlice.actions.deletePayment({id: '2'});

      const result = paymentsSlice.reducer(payments, action);

      expect(result).toHaveLength(2);
      expect(result).toContain(payments[0]);
      expect(result).not.toContain(payments[1]);
    });

    it('should not change the list if the id is not found', () => {
      const payments: Payment[] = [
        makePayment('1'),
        makePayment('2'),
        makePayment('3'),
      ];

      const action = paymentsSlice.actions.deletePayment({id: '4'});

      const result = paymentsSlice.reducer(payments, action);

      expect(result).toHaveLength(3);
    });
  });
});
