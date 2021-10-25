import { expect, SkyHostBrowser } from '@skyux-sdk/e2e';

describe('Numeric', () => {
  it('should match screenshot', async (done) => {
    await SkyHostBrowser.get('visual/numeric');
    await SkyHostBrowser.setWindowBreakpoint('xs');
    await expect('.sky-numeric-demo').toMatchBaselineScreenshot(done, {
      screenshotName: 'numeric-xs',
    });
  });
});
