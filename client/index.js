var Discord   = require('discord.js');
var client    = new Discord.Client();

client.on('ready', function() {
  console.log("Logged in as " + client.user.tag);
});

module.exports = client;