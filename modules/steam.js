const keys = require('../util/keys')
const SteamApi = require('steam-api')
const request = require('request')

const player = new SteamApi.Player(keys.STEAM.KEY)
const user = new SteamApi.User(keys.STEAM.KEY)

// Displays nickname and profile link of the Steam ID (64-bit) presented
module.exports.GetPlayerDetails = function (message) {
  const steamId = message.content.slice(9)

  if (steamId.trim() === '') return

  const url = 'http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=' + keys.STEAM.KEY + '&steamids=' + steamId

  request(url, (err, res, body) => {
    if (err) return console.log(err)

    const json = JSON.parse(body)
    const profile = json.response.players[0]

    message.channel.send(`Nickname: ${profile.personaname}\n${profile.profileurl}`)
  })
}

// Displays the level of the user associated to the Steam ID (64-bit)
module.exports.GetPlayerLevel = (message) => {
  const steamId = message.content.slice(7)

  if (steamId.trim() !== '') return

  player.GetSteamLevel(steamId).done((result) => {
    message.channel.send(`Steam Level is: ${result}`)
  })
}

// Sends in Direct Message all Steam friends from the associated Steam ID (64-bit)
// in the format nickname, profile link for each friend
module.exports.GetSteamFriends = function (message) {
  const steamId = message.content.slice(9)

  if (steamId.trim() === '') return

  user.GetFriendList('all', steamId).done((result) => {
    const friends = []
    result.forEach((player) => {
      friends.push(`Nickname: ${player.personaname}\n${player.profileurl}`)
    })
    const friendArr = splitStrByTextLimit(friends.join('\n'))
    message.channel.send('Check your DMs')
    message.author.sendMessage('Steam friends list: \n')
    friendArr.forEach((block) => {
      message.author.sendMessage(block)
    })
  })
}

// Feel the shame of how many games are unplayed by the associated Steam ID (64-bit)
module.exports.GetNumUnPlayedGames = function (message) {
  const steamId = message.content.slice(11)

  if (steamId.trim === '') return

  player.GetOwnedGames(steamId)
    .catch((err) => {
      console.log(err)
    })
    .done((result) => {
      let numUnplayed = 0
      let total = 0
      const listUnplayed = []

      result.forEach((game) => {
        total += 1
        if (game.playtimeForever === '0') {
          numUnplayed += 1
          listUnplayed.push(game.name)
        }
      })
      const gameArr = splitStrByTextLimit(listUnplayed.join('\n'))
      message.channel.send(`shame shame ${numUnplayed.toString()} unplayed games out of ${total.toString()}\n
                            List of shame sent via DMs`)

      message.author.sendMessage('YOUR LIST OF SHAME:\n')
      gameArr.forEach((block) => {
        message.author.sendMessage(block)
      })
    })
}

// Splits the string into the maximum allowed characters returned in an array
function splitStrByTextLimit (lineOfText) {
  const maxLength = 2000 // Discord's max character limit
  const parsedList = []
  while (lineOfText.length > maxLength) {
    let pos = lineOfText.substring(0, maxLength).lastIndexOf('\n')
    pos = pos <= 0 ? maxLength : pos
    parsedList.push(lineOfText.substring(0, pos))
    let i = lineOfText.indexOf('\n', pos) + 1
    if (i < pos || i > pos + 1) {
      i = pos
    }
    lineOfText = lineOfText.substring(i)
  }
  parsedList.push(lineOfText)
  return parsedList
}
