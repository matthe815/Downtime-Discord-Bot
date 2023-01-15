const outcomeFiles = ['outcomes.txt', 'useroutcomes.txt']
const fs = require('fs')
const path = require('path')

let OUTCOMES = []

outcomeFiles.forEach(filename => {
  const data = fs.readFileSync(path.resolve(__dirname, '../../data/million', filename), 'utf8')
  OUTCOMES = OUTCOMES.concat(data.split('\n'))
})

/**
 * Adds a outcome for the millions questions.
 * @param {Message} message
 */
module.exports.add = (message) => {
  const outcome = message.options.get('outcome')?.value

  if (outcome.trim() === '') {
    message.reply('You must supply content for an outcome to be added.')
    return
  }

  OUTCOMES.push(outcome)
  fs.appendFileSync(path.resolve(__dirname, '../../data/million', 'useroutcomes.txt'), `${outcome}\n`)
  message.reply(`Added outcome '${outcome}'`)
}

module.exports.add.command = {
  name: 'addoutcome',
  description: 'Adds an outcome for the million questions',
  options: [
    {
      name: 'outcome',
      description: 'The outcome to add',
      type: 3,
      required: true
    }
  ]
}

module.exports.get = () => OUTCOMES
