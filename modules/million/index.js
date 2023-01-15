const ScoreHandler = require('./ScoreHandler')
const ONE_MINUTE = 60000

const conditions = require('./Conditions').get()
const outcomes = require('./Outcomes').get()

let inRound = false
const roundResults = {}
let currentQ = ''
let currentQEndtime = 0

/**
 * @typedef Message
 * @prop {string} content
 * @prop {Channel} channel
 */

/**
 * @typedef Channel
 * @prop {string} id
 * @prop {string} name
 * @prop {string} type
 * @prop {Promise<Message>} send
 */

function produceQuestion () {
  const condition = conditions[Math.floor(conditions.length * Math.random())]
  const outcome = outcomes[Math.floor(outcomes.length * Math.random())]

  return `You get a million dollars, but... ${condition.trim()}, ${outcome.trim()}`
}

/**
   * End the round, and display the results.
   */
function endRound (message) {
  inRound = false
  let resultsStr = ''

  for (const userId in roundResults) {
    resultsStr += `${message.guild.members.cache.find((user) => user.id === userId)}: ${roundResults[userId]}\n`
  }

  // Nobody voted, so handle it different
  if (resultsStr === '') {
    message.channel.send('The round is over, and... nobody voted.')
    return
  }

  message.channel.send(`The round is over! Here were the votes for '${currentQ}':\n${resultsStr}`)
  ScoreHandler.write(roundResults)
}

/**
 * Produces a new question or recites the current ongoing question
 * @param {Message} message
 */
module.exports.question = async (interaction) => {
  // Produce a new question if not in a round, otherwise display the current one.
  switch (inRound) {
    case false:
      inRound = true
      setTimeout(() => { endRound(interaction) }, ONE_MINUTE * 2)
      currentQEndtime = new Date(Date.now() + (ONE_MINUTE * 2)).getTime()

      currentQ = produceQuestion()

      await interaction.reply({ content: currentQ })
      await interaction.followUp({ content: 'This is the scenario for the current round! Please vote now!' })
      return
    case true:
      interaction.reply({ content: `We're still open for voting! I will post when this round is over. The current scenario is: ${currentQ}; remaining time: ${Math.floor(((currentQEndtime - new Date().getTime()) / 1000))} seconds.` })
  }
}

module.exports.question.command = {
  name: 'million',
  description: 'Produces a new question or recites the current ongoing question',
  options: []
}

/**
 * When the user responds yes, or a variation of yes.
 * @param {Message} message
 */
module.exports.yes = (message) => {
  if (!inRound) return
  roundResults[message.user.id] = 'Yes'

  message.reply({ content: 'Your vote has been recorded!', flags: 64 })
}

/**
 * When the user responds no, or a variation of no.
 * @param {Message} message
 */
module.exports.no = (message) => {
  if (!inRound) return
  roundResults[message.user.id] = 'No'

  message.reply({ content: 'Your vote has been recorded!', flags: 64 })
}
