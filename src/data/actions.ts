import {childSlice} from './children/childReducer';
import {paymentsSlice} from './payments/paymentReducer';
import {settingsSlice} from './settings/slice';

export default {
  ...childSlice.actions,
  ...paymentsSlice.actions,
  ...settingsSlice.actions,
};
