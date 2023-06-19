import {device, expect} from 'detox';
import {addChild, deletePayment, makePayment} from './utils/helpers';
import {HomeScreen, StartScreen} from './utils/elements';
import {format, subWeeks} from 'date-fns';

const {offlineButton} = StartScreen;
const {amountOwed, lastPaidDate, paymentHistoryButton, owedTitle} = HomeScreen;

describe('Make Payment', () => {
  beforeAll(async () => {
    await device.launchApp();
    await offlineButton().tap();
    await addChild({beginningOfTime: subWeeks(new Date(), 1)});
    await expect(amountOwed()).toHaveText('£1');
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  afterEach(async () => {
    await paymentHistoryButton().tap();
    await deletePayment(0);
    await element(by.text('Back')).tap();
  });

  it('should be able to pay the owed amount', async () => {
    await makePayment('owed');
    await expect(amountOwed()).toHaveText('0');
    await expect(lastPaidDate()).toHaveText(
      `${format(new Date(), 'do LLLL')} (today)`,
    );
  });

  it('should be possible to pay less than the owed amount', async () => {
    await makePayment('under');
    await expect(amountOwed()).toHaveText('50p');
    await expect(lastPaidDate()).toHaveText(
      `${format(new Date(), 'do LLLL')} (today)`,
    );
  });

  it('should be possible to over-pay', async () => {
    await makePayment('over');
    await expect(owedTitle()).toHaveText('You have overpaid by');
    await expect(amountOwed()).toHaveText('50p');
  });
});
