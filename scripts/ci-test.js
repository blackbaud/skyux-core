const logger = require('@blackbaud/skyux-logger');
const path = require('path');

const KarmaServer = require('karma').Server;
const karmaConfigUtil = require('karma').config;
const karmaLogger = require('karma/lib/logger');

function test() {

  karmaLogger.setupFromConfig({});

  const karmaConfig = karmaConfigUtil.parseConfig(path.resolve(__dirname, 'karma.conf.js'));

  return new Promise(resolve => {
    const server = new KarmaServer(karmaConfig, (exitCode) => {
      logger.info(`Karma has exited with ${exitCode}.`);
      resolve(exitCode);
    });

    server.on('browser_error', err => {
      logger.warn('BROWSER_ERROR: ' + err);
    });

    server.start();
  });
}

test().then(exitCode => process.exit(exitCode));
