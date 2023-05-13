import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {initialState} from '../initialState';
import {Settings} from '../types';
import {formatDate} from '../utils';

const switchChild = (state: Settings, action: PayloadAction<{id: string}>) => {
  state.currentChild = action.payload.id;
  console.log('SWITCH CHILD', action, state);
  return state;
};

const updateCurrentDate = (state: Settings) => {
  state.currentDate = formatDate(new Date());
  return state;
};

const setBackupKey = (
  state: Settings,
  action: PayloadAction<{key: string}>,
) => {
  state.backupKey = action.payload.key;
  return state;
};

export const settingsSlice = createSlice({
  name: 'global',
  initialState: initialState.settings,
  reducers: {switchChild, updateCurrentDate, setBackupKey},
});
