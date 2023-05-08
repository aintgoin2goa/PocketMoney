import {Child, State} from './types';
import {formatDate, uid} from './utils';

const initialChild: Child = {
  id: uid('CHILD'),
  name: '',
  payments: [],
  settings: {
    currency: {major: '£', minor: 'p'},
    pocketMoneyPerWeek: 1,
    payDay: 6,
    beginningOfTime: formatDate(new Date()),
  },
};

export const initialState: State = {
  payments: [],
  children: [initialChild],
  global: {
    currentChild: initialChild.id,
    currentDate: formatDate(new Date()),
    backupKey: '',
  },
  currentChild: 0,
};
