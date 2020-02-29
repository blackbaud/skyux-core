import {
  expect,
  SkyHostBrowser
} from '@skyux-sdk/e2e';

import {
  by,
  element
} from 'protractor';

describe('Affix', function () {

  beforeEach(function () {
    SkyHostBrowser.get('demos/affix');
    SkyHostBrowser.setWindowDimensions(2000, 2000);
    element(by.id('screenshot-affix-button-scroll-to-target')).click();
  });

  function stepAffixCycle() {
    return element(by.id('screenshot-affix-button-step-cycle')).click();
  }

  function takeScreenshots(parent: string) {
    return Promise.all(
      [
        {
          placement: 'above',
          alignment: 'right'
        },
        {
          placement: 'above',
          alignment: 'center'
        },
        {
          placement: 'above',
          alignment: 'left'
        },
        {
          placement: 'right',
          alignment: 'bottom'
        },
        {
          placement: 'right',
          alignment: 'middle'
        },
        {
          placement: 'right',
          alignment: 'top'
        },
        {
          placement: 'below',
          alignment: 'left'
        },
        {
          placement: 'below',
          alignment: 'center'
        },
        {
          placement: 'below',
          alignment: 'right'
        },
        {
          placement: 'left',
          alignment: 'top'
        },
        {
          placement: 'left',
          alignment: 'middle'
        },
        {
          placement: 'left',
          alignment: 'bottom'
        }
      ].map(o => new Promise(resolve => {
        stepAffixCycle().then(() => {
          expect('#screenshot-affix').toMatchBaselineScreenshot(resolve, {
            screenshotName: `affix-${parent}-${o.placement}-${o.alignment}`
          });
        });
      }))
    );
  }

  it('should match window screenshots', async function (done) {
    await takeScreenshots('window');
    await element(by.id('screenshot-affix-button-scrollable-parent')).click();
    done();
  });

  it('should match scroll parent screenshots', async function (done) {
    await element(by.id('screenshot-affix-button-scrollable-parent')).click();
    await takeScreenshots('scroll-parent');
    done();
  });

});
