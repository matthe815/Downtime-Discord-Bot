module.exports.dice = (interaction) => {
  // Get the number of faces and dice to roll
  const faces = interaction.options.getInteger('faces')
  const diceCount = interaction.options.getInteger('dice')

  // Get the default values if not set.
  const dice = parseInt(diceCount) || 1
  const eyes = parseInt(faces) || 6

  let sum = 0

  // Create an array of diceCount length and fill it with undefined to map with random values based on face count
  const values = new Array(dice).fill(undefined).map(() => {
    const e = Math.floor(Math.random() * eyes) + 1
    sum += e
    return e
  })

  values.sort()
  values.reverse()

  // state the user who rolled, what they rolled, the value of what they rolled
  interaction.reply({
    content: `${interaction.user.username} rolled ${dice} dice with ${eyes} faces and got ${values.join(', ')} for a total of ${sum}`
  })
}

module.exports.dice.command = {
  name: 'dice',
  description: 'Roll a dice',
  options: [
    {
      name: 'faces',
      description: 'The number of faces on the dice',
      type: 4
    },
    {
      name: 'dice',
      description: 'The dice to roll',
      type: 4
    }
  ]
}

module.exports.pick = function (message) {
  const args = message.content.slice(5).split(',')
  const pick = Math.floor(Math.random() * args.length)
  message.channel.send(`I choose ${args[pick].trim()}`)
}
