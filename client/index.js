const Discord   = require('discord.js')
const client    = new Discord.Client()
const modules   = require('../modules')

client.on('ready', () => {
  console.log("Logged in as " + client.user.tag)
  modules.listen(client)
})

client.on('message', message => {
  const content = message.content
  try {
    if (message.author.bot) return

    const command = content.indexOf(" ") >= 0 ? content.substr(0, content.indexOf(" ")).toLowerCase() : content.toLowerCase()

    if (modules.messageRoutes[command]) {
      modules.messageRoutes[command](message)
    }
  } catch(e) {
    console.warn(`error occured while attempting to handle message syncronously: ${content}`)
    console.warn(`Error: ${e}`)
  }
})

//create event listener for new members
client.on('guildMemberAdd', member => {
    //Sends greeting to the channel for system messages (has to be set in server settings), mentioning the member.
    if(member.guild.systemChannel != null)
      member.guild.systemChannel.send(`Welcome to the server, ${member.displayName}!`);
})

//create event listener for when members leave server
client.on('guildMemberRemove', member => {
    //Sends leave message to the channel for system messages (has to be set in server settings)
    if(member.guild.systemChannel != null)
      member.guild.systemChannel.send(`${member.displayName} has left the server.`);
})

module.exports = client
