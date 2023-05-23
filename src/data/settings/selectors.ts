import {State} from '../types';

export const getActiveChildId = (state: State) => {
  return state?.settings?.currentChild ?? '';
};

export const getBackupKey = (state: State) => {
  return state?.settings?.backupKey ?? '';
};

export const getOfflineMode = (state: State) => {
  return state?.settings?.offlineMode ?? false;
};
