module.exports = (config) => {

  const minimist = require('minimist');
  const skyPagesConfigUtil = require('@skyux-sdk/builder/config/sky-pages/sky-pages.config');
  const testWebpackConfig = require('./webpack.config');

  const argv = minimist(process.argv.slice(2));
  const skyPagesConfig = skyPagesConfigUtil.getSkyPagesConfig(argv._[0]);
  const webpackConfig = testWebpackConfig.getWebpackConfig(skyPagesConfig, argv);

  const specBundle = `${__dirname}/spec-bundle.js`;

  const preprocessors = {};
  preprocessors[specBundle] = ['webpack'];

  const useBrowserStack = (argv.browserstack === true);

  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    reporters: ['dots'],
    singleRun: true,
    failOnEmptyTestSuite: false,
    logLevel: config.LOG_INFO,
    browsers: ['ChromeHeadless'],

    // Webpack
    webpack: webpackConfig,
    preprocessors,
    files: [
      {
        pattern: specBundle,
        watched: false
      }
    ]
  });

  if (useBrowserStack) {
    console.log('Launching BrowserStack...');
    config.set({
      browserStack: {},
      customLaunchers: {
        bs_chrome_mac: {
          base: 'BrowserStack',
          browser: 'Chrome',
          os: 'OS X',
          os_version: 'Mountain Lion'
        }
      },
      browsers: ['bs_chrome_mac'],
      reporters: ['dots', 'BrowserStack']
    });
  }
};