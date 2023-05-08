export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type DateString = string;

export type Payment = {
  id: string;
  date: DateString;
  owed: number;
  paid: number;
  remaining: number;
  child: string;
  childId: string;
};

export type CurrencySymbol = {
  major: string;
  minor: string;
};

export type Settings = {
  currency: CurrencySymbol;
  pocketMoneyPerWeek: number;
  payDay: DayOfWeek;
  beginningOfTime: DateString;
};

export type Child = {
  id: string;
  name: string;
  settings: Settings;
  payments: Payment[];
};

export type Global = {
  currentChild: string;
  currentDate: DateString;
  backupKey: string;
};

export type State = {
  currentChild: number;
  children: Child[];
  payments: Payment[];
  global: Global;
};
