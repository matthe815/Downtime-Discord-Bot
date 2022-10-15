const danbooru  = require('./danbooru')
const flickr    = require('./flickr')
const million   = require('./million')
const ping      = require('./ping')
const quote     = require('./quote')
const random    = require('./random')
const troll     = require('./troll')
const steam     = require('./steam')
const urban     = require('./urban')

const listeners = [
]

async function help (message) {
  cmds = Object.keys(module.exports.messageRoutes)
  cmdstr = cmds.join("\n")
  await message.author.sendMessage("Bot Commands list\n\*" + cmdstr + "\*")
}

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

  // Troll commands
  ">f": troll.F,
  ">rip": troll.rip,
  ">throw": troll.tablethrow,
  ">lenny": troll.lenny,
  ">lennyface": troll.lenny,
  ">shameshame": troll.shame,

  ">details": steam.GetPlayerDetails,
  ">level": steam.GetPlayerLevel,
  ">friends": steam.GetSteamFriends,
  ">gameshame": steam.GetNumUnPlayedGames,

  // Help
  ">help": help
}

module.exports.listen = function(client) {
  listeners.forEach(lFunc => lFunc(client))
}