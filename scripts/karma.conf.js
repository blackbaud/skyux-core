const applyBuilderConfig = require('@skyux-sdk/builder/config/karma/shared.karma.conf');

module.exports = (config) => {

  applyBuilderConfig(config);

  config.set({
    browserStack: {
      username: process.env.BROWSER_STACK_USERNAME,
      accessKey: process.env.BROWSER_STACK_ACCESS_KEY
    },
    customLaunchers: {
      bs_firefox_mac: {
        base: 'BrowserStack',
        browser: 'firefox',
        browser_version: '21.0',
        os: 'OS X',
        os_version: 'Mountain Lion'
      }
    },
    browsers: ['bs_firefox_mac']
  });
};