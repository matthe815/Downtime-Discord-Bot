var danbooru  = require('./danbooru');
var flickr    = require('./flickr');
var million   = require('./million');
var ping      = require('./ping');
var quote     = require('./quote');
var random    = require('./random');
var urban     = require('./urban');
var f         = require('./f');

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
  ">hug": flickr.hug,

  // danbooru
  ">safe": danbooru.safe,
  ">ecchi": danbooru.ecchi,
  ">nsfw": danbooru.nsfw,

  // Random
  ">dice": random.dice,
  ">roll": random.dice,
  ">pick": random.pick,

  // Urban Dictionary
  ">urban": urban.urban,

  // Quote
  ">quote": quote.quote,

  // Respects Paid
  ">f": f.F,
  ">rip": f.rip
};