const DownTimeClient = require('./client/index')
const keys = require('./util/keys')

new DownTimeClient().login(keys.DISCORD.TOKEN)
