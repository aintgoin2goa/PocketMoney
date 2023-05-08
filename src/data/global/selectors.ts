import {State} from '../types';

export const getActiveChildId = (state: State) => {
  return state?.global?.currentChild ?? '';
};

export const getBackupKey = (state: State) => {
  return state?.global?.backupKey ?? '';
};
