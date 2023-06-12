import {createSlice} from '@reduxjs/toolkit';
import {initialState} from '../initialState';
import {Payment} from '../types';

const isValidPayment = (payment: unknown): payment is Payment => {
  if (!payment || typeof payment !== 'object' || !('childId' in payment)) {
    return false;
  }

  const possiblePayment = payment as Payment;

  if (
    typeof possiblePayment.childId !== 'string' ||
    !possiblePayment.childId.length
  ) {
    return false;
  }

  return true;
};

const makePayment = (
  payments: Payment[],
  action: {type: string; payload: Payment},
) => {
  const {payload} = action;
  if (!isValidPayment(payload)) {
    // console.log('makePaymentHandler', 'INVALID_PAYMENT', payload);
    return payments;
  }

  payments.push(payload);

  return payments;
};

const deletePayment = (
  payments: Payment[],
  action: {type: string; payload: {id: string}},
) => {
  const index = payments.findIndex(p => p.id === action.payload.id);
  if (index < 0) {
    console.error(`Payment not found!  id: ${action.payload.id}`);
  } else {
    payments.splice(index, 1);
  }

  return payments;
};

export const paymentsSlice = createSlice({
  name: 'payments',
  initialState: initialState.payments,
  reducers: {
    makePayment,
    deletePayment,
  },
});
