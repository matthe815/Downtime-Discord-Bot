const ssq     = require('source-server-query');
const keys    = require('../../util/keys');
const TIMEOUT = 3000;

function info(channel, admin, cUser) {
  ssq.info(...keys.ARK, TIMEOUT)
    .then((info) => {
      if (!info.hasOwnProperty('game')) {
        console.log(channel.send(`Uh oh! By my calculations, there's a disturbance in the ark server. Hey ${admin.toString()}, could you check this out?`))
      } else {
        cUser.setGame(`${info.playersnum} players in the Ark`)
      }
    })
    .catch(() => {
      console.log("There was an error fetching ark server info: ", err)
    })
}

function players(channel) {
  ssq.players(...keys.ARK, TIMEOUT)
    .then((players) => {
      players.forEach((player) => {
        if (player.name !== '' && player.duration > 10800) {
          const duration = Math.floor(player.duration / 3600)
          channel.send(`${player.name} has been online for over ${duration} hours. Please take a break.`)
        }
      })
    })
}

module.exports.listen = function(client) {
  const channel = client.channels.find('id', keys.ARK_CH_ID)
  const admin = client.users.find('id', keys.ARK_ADMIN)
  const cUser = client.user
  players(channel)
  info(channel, admin, cUser)
  setInterval(() => {
    players(channel)
    info(channel, admin, cUser)
  }, 3600000)
}
