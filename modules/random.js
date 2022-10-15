module.exports.dice = (message) => {
  const args = message.content.slice(5)
  const d = args.indexOf('d')

  if (d >= 0) {
    const dice = parseInt(args.slice(0, d)) || 1
    const eyes = parseInt(args.slice(d + 1)) || 6

    let sum = 0

    const values = new Array(dice).fill(undefined).map(() => {
      const e = Math.floor(Math.random() * eyes) + 1
      console.log(`e: ${e}, ${typeof (e)}`)
      sum += e
      return e
    })

    values.sort()
    values.reverse()

    message.reply(`you rolled a ${sum} (${values.join(', ')})`)
  } else {
    const diceValue = parseInt(args) || 20

    const roll = Math.floor(Math.random() * diceValue) + 1
    message.reply(`you rolled a ${roll}`)
  }
}

module.exports.pick = function (message) {
  const args = message.content.slice(5).split(',')
  const pick = Math.floor(Math.random() * args.length)
  message.channel.send(`I choose ${args[pick].trim()}`)
}
