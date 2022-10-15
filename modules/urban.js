const { EmbedBuilder } = require('@discordjs/builders')
const request = require('request')

module.exports.urban = function (message) {
  const query = message.content.slice(6)
  request(`http://api.urbandictionary.com/v0/define?term=${query}`, (err, res, body) => {
    if (err) console.log(err)

    try {
      const result = JSON.parse(body).list[0]

      const embed = new EmbedBuilder()
        .setAuthor({ name: 'Urban Dictionary', iconURL: 'https://lh5.ggpht.com/oJ67p2f1o35dzQQ9fVMdGRtA7jKQdxUFSQ7vYstyqTp-Xh-H5BAN4T5_abmev3kz55GH=w300' })
        .setColor(15728384)
        .setTitle(result.world)
        .setDescription(result.definition)
        .setURL(result.permalink)
        .setFooter({ text: `By: ${result.author}` })

      message.channel.send(embed)
    } catch (e) {
      console.log(e)
      message.channel.send('Failed to get data from urbandictionary')
    }
  })
}
