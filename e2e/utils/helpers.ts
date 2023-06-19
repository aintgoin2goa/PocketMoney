import {HomeScreen, ChildEditor, PaymentHistory} from './elements';

const {childSwitcherButton, addChildButton, paySlider, payButton} = HomeScreen;
const {
  nameInput,
  dayPicker,
  pocketMoneyPence,
  pocketMoneyPounds,
  currencyPicker,
  changeCurrency,
  changeDayButton,
  changeBeginDate,
  beginDatePicker,
  saveButton,
} = ChildEditor;
const {payment} = PaymentHistory;

export const start = async () => {};

export const addChild = async ({
  name = 'TestChild',
  pocketMoneyDay = 'Saturday',
  pocketMoney = [1, 0],
  currency = '£',
  beginningOfTime = new Date(),
} = {}) => {
  await childSwitcherButton().tap();
  await addChildButton().tap();
  await nameInput().typeText(name);
  await pocketMoneyPounds().typeText(pocketMoney[0].toString());
  await pocketMoneyPence().typeText(pocketMoney[1].toString());
  await setCurrency(currency);
  await setPocketMoneyDay(pocketMoneyDay);
  await setBeginDate(beginningOfTime);
  await saveButton().tap();
};

export const setPocketMoneyDay = async (day: string) => {
  await changeDayButton().tap();
  await dayPicker().setColumnToValue(0, day);
  await element(by.text('OK')).tap();
};

export const setCurrency = async (currency: string) => {
  await changeCurrency().tap();
  await currencyPicker().setColumnToValue(0, currency);
  await element(by.text('OK')).tap();
};

export const setBeginDate = async (date: Date) => {
  await changeBeginDate().tap();
  await beginDatePicker().setDatePickerDate(date.toISOString(), 'ISO8601');
  await element(by.text('OK')).tap();
};

export const makePayment = async (amount: 'owed' | 'under' | 'over') => {
  await payButton().tap();
  if (amount !== 'owed') {
    const slide = amount === 'over' ? 'right' : 'left';
    await paySlider().swipe(slide, 'slow', 0.1, 0.5);
  }
  await element(by.text('OK')).tap();
};

export const deletePayment = async (index: number) => {
  await payment(index).swipe('left');
  await element(by.text('Delete')).tap();
  await element(by.text('Yes')).tap();
};
