const { EmbedBuilder } = require('@discordjs/builders')
const request = require('request')

module.exports.urban = (message) => {
  const query = message.content.slice(6)

  // Expect something after the message
  if (query.trim() === '') return message.channel.send('Invalid arguments, expecting something after the command.')

  request(`http://api.urbandictionary.com/v0/define?term=${query}`, (err, _, body) => {
    if (err) return console.log(err) // Safely handle errors.

    try {
      const result = JSON.parse(body).list[0]

      const embed = new EmbedBuilder()
        .setAuthor({ name: 'Urban Dictionary', iconURL: 'https://lh5.ggpht.com/oJ67p2f1o35dzQQ9fVMdGRtA7jKQdxUFSQ7vYstyqTp-Xh-H5BAN4T5_abmev3kz55GH=w300' })
        .setColor(15728384)
        .setTitle(result.word)
        .setDescription(result.definition)
        .setURL(result.permalink)
        .setFooter({ text: `By: ${result.author}` })

      message.channel.send({ embeds: [embed] })
    } catch (e) {
      console.log(e)
      message.channel.send('Failed to get data from urbandictionary')
    }
  })
}
