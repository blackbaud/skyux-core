const crossSpawn = require('cross-spawn');

async function runAsync() {
  console.log('Building schematics...');
  crossSpawn.sync('npm', ['run', 'postbuild']);
  console.log('Done building schematics.');
}

module.exports = {
  runAsync
};
