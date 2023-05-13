import {combineReducers, Reducer} from 'redux';
import {childSlice} from '../children/childReducer';
import {paymentsSlice} from '../payments/paymentReducer';
import {settingsSlice} from '../settings/slice';
import {State} from '../types';
import {globalReducer} from './global-reducer';

const combinedReducers = combineReducers({
  children: childSlice.reducer,
  payments: paymentsSlice.reducer,
  settings: settingsSlice.reducer,
});

export const rootReducer: Reducer<State> = (state, action) => {
  const combinedState = combinedReducers(state, action);
  return globalReducer(combinedState, action);
};
