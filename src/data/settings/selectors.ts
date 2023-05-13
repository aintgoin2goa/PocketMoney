import {State} from '../types';

export const getActiveChildId = (state: State) => {
  return state?.settings?.currentChild ?? '';
};

export const getBackupKey = (state: State) => {
  return state?.settings?.backupKey ?? '';
};
