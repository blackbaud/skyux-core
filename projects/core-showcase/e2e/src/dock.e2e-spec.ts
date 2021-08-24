import {
  expect,
  SkyHostBrowser
} from '@skyux-sdk/e2e';

describe('Dock', () => {

  beforeEach(async () => {
    await SkyHostBrowser.get('visual/dock');
    await SkyHostBrowser.setWindowBreakpoint('md');
    await SkyHostBrowser.scrollTo('.scroll-bottom-label');
  });

  it('should match screenshot', async (done) => {
    expect('#screenshot-dock').toMatchBaselineScreenshot(done, {
      screenshotName: 'dock'
    });
  });

});
