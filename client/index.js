const { Client, Events, Routes, REST, InteractionType } = require('discord.js')
const modules = require('../modules')
const CommandRegistry = require('./commandModules')
const { runUpdateCheck } = require('./updateChecker')

class DowntimeClient extends Client {
  constructor () {
    super({ intents: ['GuildMessages', 'Guilds', 'MessageContent'] })

    /**
     * The command modules for the bot
     * @type {typeof import('../modules')}
     */
    this.modules = modules

    this.commands = CommandRegistry.makeCommands()

    this.previousDay = new Date().getTime() % (86400000 / 2)

    this.rest = new REST({ version: '10' })

    this.once(Events.ClientReady, this.onReady.bind(this))
    this.on(Events.InteractionCreate, this.onInteractionCreated.bind(this))
    setInterval(this.onNextDay, 60000)
  }

  // Fired on client ready event
  onReady () {
    console.log('Ready')

    this.rest.setToken(this.token)

    this.rest.put(
      Routes.applicationCommands(this.user.id),
      { body: CommandRegistry.makeCommandListResponse() }
    )

    modules.millionare.startGame(this)
    runUpdateCheck()
  }

  // Fired when an application interaction is recieved
  onInteractionCreated (interaction) {
    switch (interaction.type) {
      case InteractionType.MessageComponent: // If someone clicks a button
        modules.millionare.handleResponse(interaction)
        break

      case InteractionType.ApplicationCommand: // If someone uses a slash command
        if (this.commands[interaction.commandName]) this.commands[interaction.commandName](interaction)
        break
    }
  }

  onNextDay () {
    const now = new Date().getTime() % (86400000 / 2)
    if (now < this.previousDay) return

    this.previousDay = now

    modules.millionare.startGame(this)
    runUpdateCheck() // Run the update check alongside the daily reset
  }
}

module.exports = DowntimeClient
