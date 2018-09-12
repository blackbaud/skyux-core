const fs = require('fs-extra');
const compat = require('../utils/node-js/compat');

function copyUtils() {
  fs.copySync('./utils', './dist/utils');
}

compat.injectLocaleResourcesContents();
copyUtils();
