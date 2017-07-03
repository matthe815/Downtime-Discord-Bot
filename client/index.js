var Discord   = require('discord.js');
var client    = new Discord.Client();
var modules   = require('../modules');

client.on('ready', function() {
  console.log("Logged in as " + client.user.tag);
});

client.on('message', function(message) {
  if (message.author.bot) return;
  var content = message.content;
  var command = content.indexOf(" ") >= 0 ? content.substr(0, content.indexOf(" ")).toLowerCase() : content.toLowerCase();

  if (modules.messageRoutes[command]) modules.messageRoutes[command](message);
});

module.exports = client;