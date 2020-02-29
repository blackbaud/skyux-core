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
    SkyHostBrowser.setWindowBreakpoint('md');
    element(by.id('screenshot-affix-button-scroll-to-target')).click();
  });

  function stepAffixCycle() {
    return element(by.id('screenshot-affix-button-step-cycle')).click();
  }

  it('should match screenshots', async function (done) {
    await Promise.all(
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
          alignment: 'right'
        },
        {
          placement: 'below',
          alignment: 'center'
        },
        {
          placement: 'below',
          alignment: 'left'
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
            screenshotName: `affix-${o.placement}-${o.alignment}`
          });
        });
      }))
    );

    done();
  });

});
