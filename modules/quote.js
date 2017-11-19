module.exports.quote = async function(message){
  const mention = message.mentions.users.first()
  if(!mention) return

  const toQuote = message.channel.messages.filter(msg => {
    return (msg.author.id === mention.id.toString() &&
            msg.id !== message.id &&
            msg.type === 'DEFAULT')
  }).last()

  const result = await message.channel.send({embed: {
    color: 1811429,
    author: {
      name: toQuote.author.username,
      icon_url: toQuote.author.avatarURL
    },
    description: toQuote.content,
    timestamp: new Date(toQuote.createdTimestamp)
  }})
  result.pin()  
}