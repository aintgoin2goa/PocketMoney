import {createAction, createReducer, PayloadAction} from '@reduxjs/toolkit';
import {initialState} from '../initialState';
import {State} from '../types';

export const restoreBackup = createAction<State>('global/restore');

export const globalReducer = createReducer(initialState, builder => {
  builder.addCase(
    restoreBackup,
    (state: State, action: PayloadAction<State>) => {
      return action.payload;
    },
  );
});
