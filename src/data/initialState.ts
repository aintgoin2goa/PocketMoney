import {Child, State} from './types';
import {formatDate} from './utils';
import {generateUUID} from '../utils/uuid';

const initialChild: Child = {
  id: generateUUID('CHILD'),
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
  settings: {
    currentChild: initialChild.id,
    currentDate: formatDate(new Date()),
    backupKey: '',
    offlineMode: false,
  },
};
