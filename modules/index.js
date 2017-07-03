var ping = require('./ping');
var million = require('./million');

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
  ">wealth": million.scores
}