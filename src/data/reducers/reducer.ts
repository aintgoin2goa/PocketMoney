import {combineReducers} from 'redux';
import {childSlice} from '../children/childReducer';
import {paymentsSlice} from '../payments/paymentReducer';
import {globalSlice} from '../global/slice';

export const rootReducer = combineReducers({
  children: childSlice.reducer,
  payments: paymentsSlice.reducer,
  global: globalSlice.reducer,
});
