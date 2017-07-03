var yaml 	  = require('js-yaml');
var fs      = require('fs');
var path    = require('path');

var client  = require('./client');

try {
  var KEYS = yaml.safeLoad(
    fs.readFileSync(
      path.resolve(__dirname, 'keys.yml')
    )
  );
} catch(e) {
  console.log("Failed to load keys");
  throw e;
}

client.login(KEYS.DISCORD_TOKEN);