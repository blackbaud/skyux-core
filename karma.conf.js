module.exports = function (config) {

  const minimist = require('minimist');
  const webpackConfig = require('./webpack.config');

  const argv = minimist(process.argv.slice(2));
  const useBrowserStack = (argv.browserstack === true);

  const specBundle = `${__dirname}/spec-bundle.js`;

  const preprocessors = {};
  preprocessors[specBundle] = ['webpack'];

  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    reporters: ['dots'],
    singleRun: true,
    failOnEmptyTestSuite: false,
    logLevel: config.LOG_INFO,
    browsers: ['ChromeHeadless'],

    // Webpack
    webpack: webpackConfig.getWebpackConfig(),
    preprocessors,
    files: [
      {
        pattern: specBundle,
        watched: false
      }
    ]
  });

  if (useBrowserStack) {
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
