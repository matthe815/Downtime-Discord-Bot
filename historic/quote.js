const { EmbedBuilder } = require('@discordjs/builders')

/**
 * Return a quote from a user.
 * @param {require('discord.js').Message} message
 * @returns
 */
module.exports.quote = (message) => {
  // This command uses a mention/ping of the user in question. Exit function without a mention.
  // This cuts out a ton of processing.
  const mention = message.mentions.users.first()
  if (!mention) return

  // TODO; Refetch messages for this specific cache; will fail if bot restarted.
  const toQuote = message.channel.messages.cache.filter(msg => {
    return (msg.author.id === mention.id.toString() &&
            msg.id !== message.id)
  }).last()

  console.log(toQuote)

  const embed = new EmbedBuilder()
    .setColor(1811429)
    .setAuthor({ name: toQuote.author.username, iconURL: toQuote.author.avatarURL() })
    .setDescription(toQuote.content)
    .setTimestamp(new Date(toQuote.createdTimestamp))

  message.channel.send({ embeds: [embed] }).catch((err) => console.error(err)).then((msg) => msg.pin())
}
