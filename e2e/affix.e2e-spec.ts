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
    element(by.id('screenshot-affix-button-scroll-to-base-element')).click();
  });

  function stepAffixCycle() {
    return element(by.id('screenshot-affix-button-step-cycle')).click();
  }

  function takeScreenshots(parent: string) {
    return Promise.all(
      [
        {
          placement: 'above',
          horizontalAlignment: 'right',
          verticalAlignment: 'bottom'
        },
        {
          placement: 'above',
          horizontalAlignment: 'center',
          verticalAlignment: 'bottom'
        },
        {
          placement: 'above',
          horizontalAlignment: 'left',
          verticalAlignment: 'bottom'
        },
        {
          placement: 'above',
          horizontalAlignment: 'right',
          verticalAlignment: 'middle'
        },
        {
          placement: 'above',
          horizontalAlignment: 'center',
          verticalAlignment: 'middle'
        },
        {
          placement: 'above',
          horizontalAlignment: 'left',
          verticalAlignment: 'middle'
        },
        {
          placement: 'above',
          horizontalAlignment: 'right',
          verticalAlignment: 'top'
        },
        {
          placement: 'above',
          horizontalAlignment: 'center',
          verticalAlignment: 'top'
        },
        {
          placement: 'above',
          horizontalAlignment: 'left',
          verticalAlignment: 'top'
        },
        {
          placement: 'right',
          horizontalAlignment: 'left',
          verticalAlignment: 'bottom'
        },
        {
          placement: 'right',
          horizontalAlignment: 'left',
          verticalAlignment: 'middle'
        },
        {
          placement: 'right',
          horizontalAlignment: 'left',
          verticalAlignment: 'top'
        },
        {
          placement: 'below',
          horizontalAlignment: 'left',
          verticalAlignment: 'bottom'
        },
        {
          placement: 'below',
          horizontalAlignment: 'center',
          verticalAlignment: 'bottom'
        },
        {
          placement: 'below',
          horizontalAlignment: 'right',
          verticalAlignment: 'bottom'
        },
        {
          placement: 'below',
          horizontalAlignment: 'left',
          verticalAlignment: 'middle'
        },
        {
          placement: 'below',
          horizontalAlignment: 'center',
          verticalAlignment: 'middle'
        },
        {
          placement: 'below',
          horizontalAlignment: 'right',
          verticalAlignment: 'middle'
        },
        {
          placement: 'below',
          horizontalAlignment: 'left',
          verticalAlignment: 'top'
        },
        {
          placement: 'below',
          horizontalAlignment: 'center',
          verticalAlignment: 'top'
        },
        {
          placement: 'below',
          horizontalAlignment: 'right',
          verticalAlignment: 'top'
        },
        {
          placement: 'left',
          horizontalAlignment: 'right',
          verticalAlignment: 'top'
        },
        {
          placement: 'left',
          horizontalAlignment: 'right',
          verticalAlignment: 'middle'
        },
        {
          placement: 'left',
          horizontalAlignment: 'right',
          verticalAlignment: 'bottom'
        }
      ].map(o => new Promise(resolve => {
        stepAffixCycle().then(() => {
          expect('#screenshot-affix').toMatchBaselineScreenshot(resolve, {
            screenshotName: `affix-${parent}-${o.placement}-${o.horizontalAlignment}-${o.verticalAlignment}`
          });
        });
      }))
    );
  }

  it('should match window screenshots', async function (done) {
    await takeScreenshots('window');
    await element(by.id('screenshot-affix-button-overflow-parent')).click();
    done();
  }, 60000);

  it('should match scroll parent screenshots', async function (done) {
    await element(by.id('screenshot-affix-button-overflow-parent')).click();
    await takeScreenshots('scroll-parent');
    done();
  }, 60000);

});
