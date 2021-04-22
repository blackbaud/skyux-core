import { expect, SkyHostBrowser } from '@skyux-sdk/e2e';

describe('Numeric', () => {
  it('should match screenshot', async (done) => {
    await SkyHostBrowser.get('demos/numeric');
    await SkyHostBrowser.setWindowBreakpoint('xs');
    expect('.sky-numeric-demo').toMatchBaselineScreenshot(done, {
      screenshotName: 'numeric-xs'
    });
  });
});
