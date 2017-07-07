module.exports.dice = function(message){
  var args = message.content.slice(5);
  var d = args.indexOf('d');

  if(d >= 0) {
    var dice = parseInt(args.slice(0, d)) || 1;
    var eyes = parseInt(args.slice(d + 1)) || 6;

    // If we use a regular array here the values will be interpreted as strings for some reason, which causes problems when sorting.
    var values = [];
    var sum = 0;

    for(var i = 0; i < dice; ++i) {
      var e = Math.floor(Math.random() * eyes) + 1;
      sum += e;
      values.push(e);
    }

    values.sort();
    values.reverse();

    message.reply(`you rolled a ${sum} (${values.join(', ')})`);
  } else {
    var diceValue = parseInt(args) || 20;

    var roll = Math.floor(Math.random() * diceValue) + 1;
    message.reply(`you rolled a ${roll}`);
  }
};

module.exports.pick = function(message){
  var args = message.content.slice(5).split(",");
  var pick = Math.floor(Math.random() * args.length);
  message.channel.send(`I choose ${args[pick].trim()}`);
};