function getConfig(config) {
  require('@skyux-sdk/builder/config/karma/shared.karma.conf')(config);

  const configuration = {
    browsers: ['Chrome_travis_ci'],
    customLaunchers: {
      Chrome_travis_ci: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox']
      }
    }
  };

  config.set(configuration);
}

module.exports = getConfig;
