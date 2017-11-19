const request = require('request')

/**
 * The maximum number of attempts if the bot does not get an image at the first try. This may happen if the first image is marked as Loli/shota. Danbooru will
 * still list them, but not show them unless you have a gold account. This means we may, once in a while, get a response without an image path, so we cannot
 * display anything. Therefore we try again.
 */
const MAX_ATTEMPTS = 3

/** "Constant" for error messages. */
const ERROR_TRYAGAIN = "An error occured. Please try again."

/** Request and post an explicit image from danbooru. */
module.exports.nsfw = function(message){
  requestNsfwImage(message, "explicit")
}

/** Request and post a questionable image from danbooru. */
module.exports.ecchi = function(message){
  requestNsfwImage(message, "questionable")
}

/** Request and post a safe image from danbooru. */
module.exports.safe = function(message){
  requestImage(message, "safe", MAX_ATTEMPTS)
}

/**
 * If the channel is marked nsfw request an image. Otherwise tell the user this is not possible.
 * @param {Message} message The message that was received. Used to determine the channel (and the user, if necessary).
 * @param {String} rating The rating to use ('safe', 'questionable' or 'explicit'. See danbooru)
 */
function requestNsfwImage(message, rating){
  if(message.channel.nsfw)
    requestImage(message, rating, MAX_ATTEMPTS)
  else
    message.channel.send(`I'm sorry, ${message.author}, i'm afraid i can't do that.`)
}

/**
 * Request an image from danbooru and post it to the channel.
 * @param {Message} message The message that was received. Used to determine the channel
 * @param {String} rating The rating to use ('safe', 'questionable' or 'explicit'. See danbooru)
 * @param {Number} count  The number of attempts that are made, if errors occur. You may get responses without images (only visible for gold members) from
 *                        danbooru, in this case the bot makes another request.
 */
function requestImage(message, rating, attempts){
  request("https://danbooru.donmai.us/posts.json?random=true&limit=1&tags=rating:" + rating,
  (error, response, body) => {
    if(error !== null){
      // Should probably tell the user what happened, at least give them a general idea ...
      message.channel.send(ERROR_TRYAGAIN)
      return // No point in moving on, abort.
    }

    const arr = JSON.parse(body)
    const entry = arr[0]

    if(entry.hasOwnProperty("file_url"))
      message.channel.send("https://danbooru.donmai.us" + entry.file_url)
    else if(attempts > 0)
      requestImage(message, rating, attempts - 1)
    else
      message.channel.send(ERROR_TRYAGAIN)
  })
}