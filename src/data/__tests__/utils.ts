import {STERLING} from '../currencies';
import {initialState} from '../initialState';
import {Child, ChildSettings, Payment, State} from '../types';

export const makeChildSettings = (
  settings: Partial<ChildSettings> = {},
): ChildSettings => {
  const defaultSettings: ChildSettings = {
    payDay: 6,
    pocketMoneyPerWeek: 1,
    currency: STERLING,
    beginningOfTime: '',
  };

  return {...defaultSettings, ...settings};
};

export const makeChild = (id: string): Child => {
  return {
    id,
    name: id,
    settings: makeChildSettings(),
    payments: [],
  };
};

export const makeChildren = (count: number): Child[] => {
  const children: Child[] = [];
  for (let i = 0; i < count; i++) {
    children.push(makeChild(`CHILD-${i})`));
  }

  return children;
};

export const makePayment = (
  id: string,
  childId: string = '',
  other: Partial<Payment> = {},
): Payment => {
  return {
    id,
    date: '',
    owed: 0,
    paid: 0,
    remaining: 0,
    child: '',
    childId,
    ...other,
  };
};

export const makeState = (input: Partial<State> = {}): State => {
  const base = JSON.parse(JSON.stringify(initialState));
  return {...base, ...input};
};
