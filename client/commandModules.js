const modules = require('../modules')

// Make the actual command response list
module.exports.makeCommands = () => {
  const commands = {}

  for (const command of Object.entries(modules.messageRoutes)) {
    commands[command[1].command ? command[1].command.name : command[0]] = command[1]
  }

  return commands
}

// Makes the response to send to the Discord REST
module.exports.makeCommandListResponse = () => {
  const commands = Object.entries(modules.messageRoutes).map(key => (
    key[1].command ||
    {
      name: key[0].slice(1),
      description: 'None'
    }))

  return commands
}
