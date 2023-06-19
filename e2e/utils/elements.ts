export const $ = (id: string) => element(by.id(id));

export const StartScreen = {
  offlineButton: () => $('StartScreen__OfflineButton'),
};

export const HomeScreen = {
  homeScreen: () => $('HomeScreen'),
  childSwitcherButton: () => $('HomeScreen__ChildSwitcherButton'),
  addChildButton: () => $('ChildSwitcher__AddChildButton'),
  currentChild: () => $('HomeScreen__ChildName'),
  owedTitle: () => $('HomeScreen__OwedTitle'),
  amountOwed: () => $('HomeScreen__AmountOwed'),
  payButton: () => $('HomeScreen__PayButton'),
  payAmount: () => $('MoneyInput__Amount'),
  paySlider: () => $('MoneyInput__Slider'),
  lastPaidDate: () => $('HomeScreen__LastPaidDate'),
  paymentHistoryButton: () => $('HomeScreen__PaymentHistoryButton'),
};

export const ChildEditor = {
  childEditor: () => $('ChildEditor'),
  nameInput: () => $('ChildEditor__NameInput'),
  changeDayButton: () => $('ChildEditor__ChangeDay'),
  dayPicker: () => $('ChildEditor__DayPicker'),
  payDay: () => $('ChildEditor__PayDay'),
  pocketMoneyPounds: () => $('ChildEditor__Amount__Major'),
  pocketMoneyPence: () => $('ChildEditor__Amount__Minor'),
  changeCurrency: () => $('ChildEditor__ChangeCurrencyButton'),
  currencyPicker: () => $('ChildEditor__CurrencyPicker'),
  currency: () => $('ChildEditor__Currency'),
  beginDate: () => $('ChildEditor__BeginDate'),
  changeBeginDate: () => $('ChildEditor__ChangeBeginDateButton'),
  beginDatePicker: () => $('ChildEditor__DatePicker'),
  saveButton: () => $('ChildEditor__SaveButton'),
};

export const PaymentHistory = {
  payment: (index: number) => $(`PaymentHistory__Item-${index}`),
};
