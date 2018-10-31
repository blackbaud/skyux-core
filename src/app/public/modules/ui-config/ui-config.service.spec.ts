// #region imports
import {
  SkyUIConfigService
} from './ui-config.service';
// #endregion

describe('UI config service', () => {

  it('should return the default config that was passed to it', (done) => {
    const uiConfigSvc = new SkyUIConfigService();

    const defaultConfig: any = {
      foo: 'bar'
    };

    uiConfigSvc.getConfig('test-key', defaultConfig)
      .subscribe((config) => {
        expect(config).toBe(defaultConfig);
        done();
      });
  });
});
