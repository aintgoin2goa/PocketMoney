import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {initialState} from '../initialState';
import {Settings} from '../types';

const switchChild = (state: Settings, action: PayloadAction<{id: string}>) => {
  state.currentChild = action.payload.id;
  return state;
};

const setBackupKey = (
  state: Settings,
  action: PayloadAction<{key: string}>,
) => {
  state.backupKey = action.payload.key;
  return state;
};

const setOfflineMode = (state: Settings, action: PayloadAction<boolean>) => {
  state.offlineMode = action.payload;
  return state;
};

const setCurrentPayment = (state: Settings, action: PayloadAction<number>) => {
  state.currentPayment = action.payload;
  return state;
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState: initialState.settings,
  reducers: {switchChild, setBackupKey, setOfflineMode, setCurrentPayment},
});
