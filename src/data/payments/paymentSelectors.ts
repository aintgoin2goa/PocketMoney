import {createSelector} from '@reduxjs/toolkit';
import {nextDay, format} from 'date-fns';
import {formatDistance, parseDate, printCurrency} from '../utils';
import {Payment, State} from '../types';
import {getActiveChild, getSettings} from '../children/childSelectors';

export const getPayments = (state: State): Payment[] => {
  const child = getActiveChild(state);
  const payments = state.payments.filter(p => p.childId === child.id);
  if (payments.length) {
    return payments.reverse();
  }

  if (child.payments && child.payments.length) {
    return child.payments;
  }

  return [];
};

export const getLastPayment = (state: State) => {
  const payments = getPayments(state);
  return payments[0];
};

export const amountOwedSelector = createSelector(
  getLastPayment,
  getSettings,
  (payment, settings) => {
    if (!settings) {
      return 0;
    }
    let date = parseDate(
      payment && payment.date ? payment.date : settings.beginningOfTime,
    );
    const remaining = payment?.remaining ?? 0;
    const now = new Date();
    let payDays = 0;
    // console.log('amountOwedSelector', {payment, settings, date, remaining});
    date = nextDay(date, settings.payDay);
    while (now > date) {
      payDays++;
      date = nextDay(date, settings.payDay);
    }
    const owed = remaining + payDays * settings.pocketMoneyPerWeek;
    return owed;
  },
);

export const lastPaymentSelector = createSelector(getLastPayment, payment => {
  if (!payment) {
    return 'No payments found';
  }
  const date = parseDate(payment.date);
  return `${format(date, 'do LLLL')} (${formatDistance(date)})`;
});

export const nextPaymentSelector = createSelector(
  getSettings,
  settings => {
    const nextPaymentDate = nextDay(new Date(), settings.payDay);
    // console.log('nextPaymentSelector', {nextPaymentDate, now});
    return `${format(nextPaymentDate, 'EEEE do LLLL')} (${formatDistance(
      nextPaymentDate,
    )})`;
  },
  {
    memoizeOptions: {
      equalityCheck: () => false,
    },
  },
);

export const paymentHistorySelector = createSelector(
  getPayments,
  getSettings,
  (payments, settings) => {
    return payments.map((payment, index) => {
      return {
        index,
        id: payment.id,
        key: payment.id,
        date: format(parseDate(payment.date), 'EEEE do LLLL'),
        amount: printCurrency(payment.paid, settings.currency),
      };
    });
  },
);
