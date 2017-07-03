var yaml    = require('js-yaml');
var fs      = require('fs');
var path    = require('path');

try {
  var KEYS = yaml.safeLoad(
    fs.readFileSync(
      path.resolve(__dirname, '../keys.yml')
    )
  );
} catch(e) {
  console.log("Failed to load keys");
  throw e;
}

module.exports = KEYS