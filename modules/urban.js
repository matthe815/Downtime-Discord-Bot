const request = require('request')

module.exports.urban = function (message) {
  const query = message.content.slice(6)
  request(`http://api.urbandictionary.com/v0/define?term=${query}`, (err, res, body) => {
    try {
      const result = JSON.parse(body).list[0]
      message.channel.send({
        embed: {
          author: {
            name: 'urban dictionary',
            icon_url: 'https://lh5.ggpht.com/oJ67p2f1o35dzQQ9fVMdGRtA7jKQdxUFSQ7vYstyqTp-Xh-H5BAN4T5_abmev3kz55GH=w300'
          },
          color: 15728384,
          title: result.word,
          url: result.permalink,
          description: result.definition,
          footer: {
            text: `by ${result.author}`
          }
        }
      })
    } catch (e) {
      console.log(e)
      message.channel.send('Failed to get data from urbandictionary')
    }
  })
}
