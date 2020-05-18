function getConfig(config) {
  require('@skyux-sdk/builder/config/karma/shared.karma.conf')(config);

  const configuration = {
    browsers: ['Chrome']
  };

  config.set(configuration);
}

module.exports = getConfig;
