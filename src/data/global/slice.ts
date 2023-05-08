import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {initialState} from '../initialState';
import {Global} from '../types';
import {formatDate} from '../utils';

const switchChild = (state: Global, action: PayloadAction<{id: string}>) => {
  state.currentChild = action.payload.id;
  return state;
};

const updateCurrentDate = (state: Global) => {
  state.currentDate = formatDate(new Date());
  return state;
};

const setBackupKey = (state: Global, action: PayloadAction<{key: string}>) => {
  state.backupKey = action.payload.key;
  return state;
};

export const globalSlice = createSlice({
  name: 'global',
  initialState: initialState.global,
  reducers: {switchChild, updateCurrentDate, setBackupKey},
});
