import {device, expect} from 'detox';
import {addChild, deletePayment, makePayment} from './utils/helpers';
import {HomeScreen, StartScreen, PaymentHistory} from './utils/elements';

const {offlineButton} = StartScreen;
const {paymentHistoryButton} = HomeScreen;
const {payment} = PaymentHistory;

describe('Payment History', () => {
  beforeAll(async () => {
    await device.launchApp();
    await offlineButton().tap();
    await addChild();
    await makePayment('owed');
  });

  it('should be able to view payments', async () => {
    await paymentHistoryButton().tap();
    await expect(payment(0)).toBeVisible();
  });

  it('should be able to delete a payment', async () => {
    await deletePayment(0);
    await expect(payment(0)).not.toBeVisible();
  });
});
