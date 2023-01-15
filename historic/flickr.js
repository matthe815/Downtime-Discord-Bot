const keys = require('../util/keys')
const request = require('request')

const createRequestUrl = function (keyword) {
  return `https://api.flickr.com/services/rest/?method=flickr.photos.search&format=json&nojsoncallback=1&extras=url_o&api_key=${keys.FLICKR.KEY}&tag_mode=all&tags=${keyword}`
}

const getImage = function (keyword, channel) {
  request(createRequestUrl(keyword), (err, res, body) => {
    if (err) return console.log(err)
    try {
      const photos = JSON.parse(body).photos.photo.filter(photo => {
        return photo.url_o
      })

      const photo = photos[Math.floor(Math.random() * photos.length)]

      if (!photo || !photo.url_o) throw new Error('photo missing')
      channel.reply(photo.url_o)
    } catch (e) {
      channel.reply('Failed to get image from Flickr')
    }
  })
}

module.exports.birb = function (message) {
  getImage('bird', message)
}

module.exports.doggo = function (message) {
  getImage('dog', message)
}

module.exports.kitty = function (message) {
  getImage('cat', message)
}

module.exports.betta = function (message) {
  getImage('betta fish', message)
}

module.exports.hug = function (message) {
  getImage('hug', message)
}

module.exports.imageSearch = function (message) {
  getImage(message.content.slice(6), message)
}
