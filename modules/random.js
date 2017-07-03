module.exports.dice = function(message){
  var args = message.content.slice(5);
  var diceValue = parseInt(args) || 20;
  var roll = Math.floor(Math.random() * diceValue) + 1;
  message.reply(`you rolled a ${roll}`);
};

module.exports.pick = function(message){
  var args = message.content.slice(5).split(",");
  var pick = Math.floor(Math.random() * args.length);
  message.channel.send(`I choose ${args[pick].trim()}`);
};