import {
  expect,
  SkyHostBrowser
} from '@skyux-sdk/e2e';

import {
  by,
  element
} from 'protractor';

describe('Affix', () => {

  beforeEach(async () => {
    await SkyHostBrowser.get('demos/affix');
    await SkyHostBrowser.setWindowDimensions(2000, 2000);
    await element(by.id('screenshot-affix-button-scroll-to-base-element')).click();
  });

  async function checkScreenshot(
    parent: string,
    config: {
      placement: string;
      horizontalAlignment: string;
      verticalAlignment: string;
    },
    done: DoneFn
  ) {
    await element(by.id('placement-select'))
      .all(by.css(`option[value="${config.placement}"]`))
      .click();

    await element(by.id('horizontal-alignment-select'))
      .all(by.css(`option[value="${config.horizontalAlignment}"]`))
      .click();

    await element(by.id('vertical-alignment-select'))
      .all(by.css(`option[value="${config.verticalAlignment}"]`))
      .click();

    expect('#screenshot-affix').toMatchBaselineScreenshot(done, {
      screenshotName: `affix-${parent}-${config.placement}-${config.horizontalAlignment}-${config.verticalAlignment}`
    });
  }

  function checkScreenshots(parent: string) {
    it('should match screenshot', (done) => {
      checkScreenshot(parent, {
        placement: 'above',
        horizontalAlignment: 'right',
        verticalAlignment: 'bottom'
      }, done);
    });

    it('should match screenshot', (done) => {
      checkScreenshot(parent, {
        placement: 'above',
        horizontalAlignment: 'center',
        verticalAlignment: 'bottom'
      }, done);
    });

    it('should match screenshot', (done) => {
      checkScreenshot(parent, {
        placement: 'above',
        horizontalAlignment: 'left',
        verticalAlignment: 'bottom'
      }, done);
    });

    it('should match screenshot', (done) => {
      checkScreenshot(parent, {
        placement: 'above',
        horizontalAlignment: 'right',
        verticalAlignment: 'middle'
      }, done);
    });

    it('should match screenshot', (done) => {
      checkScreenshot(parent, {
        placement: 'above',
        horizontalAlignment: 'center',
        verticalAlignment: 'middle'
      }, done);
    });

    it('should match screenshot', (done) => {
      checkScreenshot(parent, {
        placement: 'above',
        horizontalAlignment: 'left',
        verticalAlignment: 'middle'
      }, done);
    });

    it('should match screenshot', (done) => {
      checkScreenshot(parent, {
        placement: 'above',
        horizontalAlignment: 'right',
        verticalAlignment: 'top'
      }, done);
    });

    it('should match screenshot', (done) => {
      checkScreenshot(parent, {
        placement: 'above',
        horizontalAlignment: 'center',
        verticalAlignment: 'top'
      }, done);
    });

    it('should match screenshot', (done) => {
      checkScreenshot(parent, {
        placement: 'above',
        horizontalAlignment: 'left',
        verticalAlignment: 'top'
      }, done);
    });

    it('should match screenshot', (done) => {
      checkScreenshot(parent, {
        placement: 'right',
        horizontalAlignment: 'left',
        verticalAlignment: 'bottom'
      }, done);
    });

    it('should match screenshot', (done) => {
      checkScreenshot(parent, {
        placement: 'right',
        horizontalAlignment: 'left',
        verticalAlignment: 'middle'
      }, done);
    });

    it('should match screenshot', (done) => {
      checkScreenshot(parent, {
        placement: 'right',
        horizontalAlignment: 'left',
        verticalAlignment: 'top'
      }, done);
    });

    it('should match screenshot', (done) => {
      checkScreenshot(parent, {
        placement: 'below',
        horizontalAlignment: 'left',
        verticalAlignment: 'bottom'
      }, done);
    });

    it('should match screenshot', (done) => {
      checkScreenshot(parent, {
        placement: 'below',
        horizontalAlignment: 'center',
        verticalAlignment: 'bottom'
      }, done);
    });

    it('should match screenshot', (done) => {
      checkScreenshot(parent, {
        placement: 'below',
        horizontalAlignment: 'right',
        verticalAlignment: 'bottom'
      }, done);
    });

    it('should match screenshot', (done) => {
      checkScreenshot(parent, {
        placement: 'below',
        horizontalAlignment: 'left',
        verticalAlignment: 'middle'
      }, done);
    });

    it('should match screenshot', (done) => {
      checkScreenshot(parent, {
        placement: 'below',
        horizontalAlignment: 'center',
        verticalAlignment: 'middle'
      }, done);
    });

    it('should match screenshot', (done) => {
      checkScreenshot(parent, {
        placement: 'below',
        horizontalAlignment: 'right',
        verticalAlignment: 'middle'
      }, done);
    });

    it('should match screenshot', (done) => {
      checkScreenshot(parent, {
        placement: 'below',
        horizontalAlignment: 'left',
        verticalAlignment: 'top'
      }, done);
    });

    it('should match screenshot', (done) => {
      checkScreenshot(parent, {
        placement: 'below',
        horizontalAlignment: 'center',
        verticalAlignment: 'top'
      }, done);
    });

    it('should match screenshot', (done) => {
      checkScreenshot(parent, {
        placement: 'below',
        horizontalAlignment: 'right',
        verticalAlignment: 'top'
      }, done);
    });

    it('should match screenshot', (done) => {
      checkScreenshot(parent, {
        placement: 'left',
        horizontalAlignment: 'right',
        verticalAlignment: 'top'
      }, done);
    });

    it('should match screenshot', (done) => {
      checkScreenshot(parent, {
        placement: 'left',
        horizontalAlignment: 'right',
        verticalAlignment: 'middle'
      }, done);
    });

    it('should match screenshot', (done) => {
      checkScreenshot(parent, {
        placement: 'left',
        horizontalAlignment: 'right',
        verticalAlignment: 'bottom'
      }, done);
    });
  }

  describe('window screenshots', () => {
    checkScreenshots('window');
  });

  describe('scroll-parent screenshots', () => {
    beforeEach(async () => {
      await element(by.id('screenshot-affix-button-overflow-parent')).click();
    });

    checkScreenshots('scroll-parent');
  });

});
