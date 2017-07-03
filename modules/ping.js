var client = require('../client');

client.on('message', function(message){
  if (message.content === "ping") {
    message.channel.send("pong");
  }
});