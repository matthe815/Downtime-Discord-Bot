var client  = require('../client');
var path    = require('path');
var fs      = require('fs');
var yaml    = require('js-yaml');

var CONDITIONS = [];
var OUTCOMES = [];
var SCORESFILE = path.resolve(__dirname, '../data/million/userscores.txt');

var inRound = false;
var roundResults = {};
var currentQ;

['conditions.txt', 'userconditions.txt'].forEach(function(filename){
  var data = fs.readFileSync(path.resolve(__dirname, '../data/million', filename), 'utf8');
  CONDITIONS = CONDITIONS.concat(data.split('\n'));
});

['outcomes.txt', 'useroutcomes.txt'].forEach(function(filename){
  var data = fs.readFileSync(path.resolve(__dirname, '../data/million', filename), 'utf8');
  OUTCOMES = OUTCOMES.concat(data.split('\n'));
});

var SCORES = yaml.safeLoad(fs.readFileSync(SCORESFILE, 'utf8'));

var produceQuestion = function(){
  var condition = CONDITIONS[Math.floor(CONDITIONS.length * Math.random())];
  var outcome = OUTCOMES[Math.floor(OUTCOMES.length * Math.random())];

  return `You get a million dollars, but... ${condition.trim()}, ${outcome.trim()}`;
};

var writeScores = function(){
  for (var user in roundResults){
    if (roundResults[user] === "Yes"){
      SCORES[user].taken++;
    } else {
      SCORES[user].refused++;
    }
  }
  fs.writeFile(SCORESFILE, yaml.safeDump(SCORES));
  roundResults = {};
};

var endRound = function(channel){
  inRound = false;
  var resultsStr = "";
  for (var user in roundResults){
    resultsStr += `${user}: ${roundResults[user]}\n`;
  }

  channel.send(`The round is over! Here were the votes for '${currentQ}':\n${resultsStr}`);
  writeScores();
};

module.exports.question = function(message){
  if (message.channel.type !== 'dm' && !inRound) {
    inRound = true;
    setTimeout(endRound.bind(this, message.channel), 90000);

    currentQ = produceQuestion();
    message.channel.send(currentQ);
    message.channel.send("This is the scenario for the current round! Please vote using '>yes' or '>no' now!");
  } else if (inRound) {
    message.channel.send(`We're still open for voting! I will post when this round is over. The current scenario is: ${currentQ}`);
  } else {
    message.channel.send(produceQuestion());
  }
};

module.exports.yes = function(message){
  if (inRound) roundResults[message.author.username] = "Yes";
};

module.exports.no = function(message){
  if (inRound) roundResults[message.author.username] = "No";
};

module.exports.scores = function(message){
  var scoreMessage = "";

  for (var user in SCORES){
    scoreMessage += `${user} has received \$${SCORES[user].taken} million so far, accepting ${Math.floor(SCORES[user].taken / (SCORES[user].taken + SCORES[user].refused) * 100)}% of voted scenarios!\n`
  }

  message.channel.send(scoreMessage);
};

module.exports.addCondition = function(message){
  fs.appendFile(path.resolve(__dirname, '../data/million', 'userconditions.txt'), message.content.slice(14));
};

module.exports.addOutcome = function(message){
  fs.appendFile(path.resolve(__dirname, '../data/million', 'useroutcomes.txt'), message.content.slice(12));
};