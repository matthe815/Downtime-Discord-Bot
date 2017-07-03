var ping = require('./ping');
var million = require('./million');
var flickr = require('./flickr');
var random = require('./random');

module.exports.messageRoutes = {
  // Ping
  ">ping": ping.ping,

  // Million Dollars Bot
  ">million": million.question,
  ">yes": million.yes,
  ">yep": million.yes,
  ">yeah": million.yes,
  ">no": million.no,
  ">nope": million.no,
  ">addcondition": million.addCondition,
  ">addoutcome": million.addOutcome,
  ">wealth": million.scores,

  // Flickr
  ">birb": flickr.birb,
  ">bird": flickr.birb,
  ">birdie": flickr.birb,
  ">dog": flickr.doggo,
  ">doggie": flickr.doggo,
  ">doggo": flickr.doggo,
  ">cat": flickr.kitty,
  ">kitty": flickr.kitty,
  ">betta": flickr.betta,
  ">image": flickr.imageSearch,

  // Random
  ">dice": random.dice,
  ">pick": random.pick
};