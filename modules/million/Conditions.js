const fs = require('fs')
const path = require('path')
const conditionFiles = ['conditions.txt', 'userconditions.txt']

let CONDITIONS = []

conditionFiles.forEach(filename => {
  const data = fs.readFileSync(path.resolve(__dirname, '../../data/million', filename), 'utf8')
  CONDITIONS = CONDITIONS.concat(data.split('\n'))
})

/**
 * Adds a condition for the million questions
 * @param {Message} message
 */
module.exports.add = (message) => {
  // the condition argument
  const condition = message.options.get('condition')?.value

  if (condition.trim() === '') {
    message.reply('You must supply content for a condition to be added.')
    return
  }

  CONDITIONS.push(condition)
  fs.appendFileSync(path.resolve(__dirname, '../../data/million', 'userconditions.txt'), `${condition}\n`)
  message.reply(`Added condition '${condition}'`)
}

module.exports.add.command = {
  name: 'addcondition',
  description: 'Adds a condition for the million questions',
  options: [
    {
      name: 'condition',
      description: 'The condition to add',
      type: 3,
      required: true
    }
  ]
}

module.exports.get = () => CONDITIONS
