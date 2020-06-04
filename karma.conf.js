module.exports = (config) => {

  const minimist = require('minimist');
  // const testWebpackConfig = require('@skyux-sdk/builder/config/webpack/test.webpack.config');
  const skyPagesConfigUtil = require('@skyux-sdk/builder/config/sky-pages/sky-pages.config');
  const testWebpackConfig = require('./webpack.config');

  const argv = minimist(process.argv.slice(2));
  const skyPagesConfig = skyPagesConfigUtil.getSkyPagesConfig(argv._[0]);
  const webpackConfig = testWebpackConfig.getWebpackConfig(skyPagesConfig, argv);

  const specBundle = `${__dirname}/node_modules/@skyux-sdk/builder/utils/spec-bundle.js`;
  const specStyles = `${__dirname}/node_modules/@skyux-sdk/builder/utils/spec-styles.js`;
  const polyfillsBundle = `${__dirname}/node_modules/@skyux-sdk/builder/src/polyfills.ts`;

  const preprocessors = {};
  preprocessors[polyfillsBundle] = ['webpack'];
  preprocessors[specBundle] = ['webpack'];
  preprocessors[specStyles] = ['webpack'];

  const useBrowserStack = (argv.browserstack === true);

  config.set({
    webpack: webpackConfig,
    preprocessors,
    files: [
      {
        pattern: polyfillsBundle,
        watched: false
      },
      {
        pattern: specBundle,
        watched: false
      },
      {
        pattern: specStyles,
        watched: false
      }
    ],
    basePath: '',
    singleRun: true,
    failOnEmptyTestSuite: false,
    logLevel: config.LOG_INFO,
    frameworks: ['jasmine'],
    reporters: ['dots'],
    browsers: ['ChromeHeadless'],
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