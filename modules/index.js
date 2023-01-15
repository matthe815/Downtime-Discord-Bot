const million = require('./million')
const ping = require('./ping')
const random = require('./random')
const millionare = require('./millionare')
const { scores } = require('./million/ScoreHandler')
const outcome = require('./million/Outcomes')
const conditions = require('./million/Conditions')

const listeners = [
]

module.exports.messageRoutes = {
  // Ping
  '>ping': ping.ping,

  // Million Dollars Bot
  '>million': million.question,
  '>yes': million.yes,
  '>yep': million.yes,
  '>yeah': million.yes,
  '>no': million.no,
  '>nope': million.no,
  '>addcondition': conditions.add,
  '>addoutcome': outcome.add,
  '>wealth': scores,

  // Millionare
  '>millionaire': millionare.scores,

  // Random
  '>dice': random.dice
}

module.exports.millionare = millionare

module.exports.listen = (client) => {
  listeners.forEach(lFunc => lFunc(client))
}
