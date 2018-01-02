const ssq = require('ssq');
const keys    = require('../../util/keys')
const server = ['MyNameIsKir.com', 27015]

function info(channel, admin, cUser) {
  ssq.info(...server, (err, info) => {
    if (err) {
      if (err.code === 'ENOTFOUND')
        channel.send(`Uh oh! By my calculations, there's a disturbance in the ark server. Hey ${admin.toString()}, could you check this out?`)
      else
        console.log("There was an error fetching ark server info: ", err)
    } else {
      cUser.setGame(`${info.numplayers} players in the Ark`)
    }
  })
}

function players(channel) {
  ssq.players(...server, (err, players) => {
    if (err)
      console.log("There was an error fetching ark server players: ", err)
    else
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
  const admin = client.users.find('id', keys.ADMIN)
  const cUser = client.user
  players(channel)
  info(channel, admin, cUser)
  setInterval(() => {
    players(channel)
    info(channel, admin, cUser)
  }, 3600000)
}