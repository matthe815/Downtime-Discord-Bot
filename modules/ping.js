/**
 * Make a test response.
 */
module.exports.ping = (message) => {
  message.channel.send(`Pong! Ping: \`${message.client.ws.ping}ms\``)
}
