/**
 * Make a test response.
 */
module.exports.ping = (message) => {
  message.reply(`Pong! Ping: \`${message.client.ws.ping}ms\``)
}

module.exports.ping.command = {
  name: 'ping',
  description: 'Make a test response.',
  options: []
}
