describe('StartScreen', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should have welcome screen', async () => {
    await expect(element(by.id('StartScreen'))).toBeVisible();
  });

  describe('when clicking the offline button', () => {
    it('should navigate to the home screen', async () => {
      await element(by.id('StartScreen__OfflineButton')).tap();
      await expect(element(by.id('HomeScreen'))).toBeVisible();
    });
  });
});
