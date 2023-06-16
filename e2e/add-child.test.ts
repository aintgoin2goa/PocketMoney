const {subWeeks, format} = require('date-fns');
import {StartScreen, HomeScreen, ChildEditor} from './utils/elements';
import {setPocketMoneyDay, setBeginDate, setCurrency} from './utils/helpers';

const {offlineButton} = StartScreen;
const {
  childSwitcherButton,
  addChildButton,
  currentChild,
  homeScreen,
  amountOwed,
} = HomeScreen;
const {
  childEditor,
  nameInput,
  payDay,
  pocketMoneyPounds,
  pocketMoneyPence,
  currency,
  beginDate,
  saveButton,
} = ChildEditor;

describe('Add Child', () => {
  beforeAll(async () => {
    await device.launchApp();
    await offlineButton().tap();
    await childSwitcherButton().tap();
    await addChildButton().tap();
  });

  it('should display the child editor', async () => {
    await expect(childEditor()).toBeVisible();
  });

  it('should let you type a name', async () => {
    await nameInput().typeText('Child1');
    await expect(nameInput()).toHaveText('Child1');
  });

  it('should let you change the pocket money day', async () => {
    await setPocketMoneyDay('Friday');
    await expect(payDay()).toHaveText('Friday');
  });

  it('should let you set the pocket money amount', async () => {
    await pocketMoneyPounds().typeText('1');
    await pocketMoneyPence().typeText('50');
    await expect(pocketMoneyPounds()).toHaveText('1');
    await expect(pocketMoneyPence()).toHaveText('50');
  });

  it('should let you change the currency', async () => {
    await setCurrency('€');
    await expect(currency()).toHaveText('€');
  });

  it('should let you change the beginning date', async () => {
    const lastWeek = subWeeks(new Date(), 1);
    await setBeginDate(lastWeek);
    await expect(beginDate()).toHaveText(format(lastWeek, 'do MMM yyyy'));
  });

  it('should be able to save the child', async () => {
    await saveButton().tap();
    await expect(homeScreen()).toBeVisible();
    await expect(currentChild()).toHaveText('Child1');
    await expect(amountOwed()).toHaveText('€1.50');
  });
});
