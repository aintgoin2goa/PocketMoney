import {childSlice} from './children/childReducer';
import {paymentsSlice} from './payments/paymentReducer';
import {globalSlice} from './global/slice';

export default {
  ...childSlice.actions,
  ...paymentsSlice.actions,
  ...globalSlice.actions,
};
