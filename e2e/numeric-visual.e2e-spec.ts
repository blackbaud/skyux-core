import {
  expect,
  SkyHostBrowser
} from '@skyux-sdk/e2e';

describe('Numeric', () => {
  it('should match screenshot', (done) => {
    SkyHostBrowser.get('demos/numeric');
    SkyHostBrowser.setWindowBreakpoint('xs');
    expect('.sky-numeric-demo').toMatchBaselineScreenshot(done);
  });
});
