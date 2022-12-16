const path = require('path')
const fs = require('fs')
const yaml = require('js-yaml')

const SCORESFILE = path.resolve(__dirname, '../data/million/userscores.txt')
const SCORES = yaml.load(fs.readFileSync(SCORESFILE, 'utf8')) || {}
const conditionFiles = ['conditions.txt', 'userconditions.txt']
const outcomeFiles = ['outcomes.txt', 'useroutcomes.txt']
const ONE_MINUTE = 60000

let conditions = []
let outcomes = []
let inRound = false
let roundResults = {}
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

conditionFiles.forEach(filename => {
  const data = fs.readFileSync(path.resolve(__dirname, '../data/million', filename), 'utf8')
  conditions = conditions.concat(data.split('\n'))
})

outcomeFiles.forEach(filename => {
  const data = fs.readFileSync(path.resolve(__dirname, '../data/million', filename), 'utf8')
  outcomes = outcomes.concat(data.split('\n'))
})

function produceQuestion () {
  const condition = conditions[Math.floor(conditions.length * Math.random())]
  const outcome = outcomes[Math.floor(outcomes.length * Math.random())]

  return `You get a million dollars, but... ${condition.trim()}, ${outcome.trim()}`
}

function writeScores () {
  for (const user in roundResults) {
    SCORES[user] = SCORES[user] || { taken: 0, refused: 0 }
    if (roundResults[user] === 'Yes') {
      SCORES[user].taken++
    } else {
      SCORES[user].refused++
    }
  }
  fs.writeFileSync(SCORESFILE, yaml.dump(SCORES))
  roundResults = {}
}

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
  writeScores()
}

/**
 * Produces a new question or recites the current ongoing question
 * @param {Message} message
 */
module.exports.question = (message) => {
  if (message.channel.type === 'dm') return // Do not react to a DM.

  // Produce a new question if not in a round, otherwise display the current one.
  switch (inRound) {
    case false:
      inRound = true
      setTimeout(() => { endRound(message) }, ONE_MINUTE * 2)
      currentQEndtime = new Date(Date.now() + (ONE_MINUTE * 2)).getTime()

      currentQ = produceQuestion()
      message.channel.send(currentQ)
      message.channel.send("This is the scenario for the current round! Please vote using '>yes' or '>no' now!")
      return
    case true:
      message.channel.send(`We're still open for voting! I will post when this round is over. The current scenario is: ${currentQ}; remaining time: ${Math.floor(((currentQEndtime - new Date().getTime()) / 1000))} seconds.`)
  }
}

/**
 * When the user responds yes, or a variation of yes.
 * @param {Message} message
 */
module.exports.yes = (message) => {
  if (!inRound) return
  roundResults[message.author.id] = 'Yes'
}

/**
 * When the user responds no, or a variation of no.
 * @param {Message} message
 */
module.exports.no = (message) => {
  if (!inRound) return
  roundResults[message.author.id] = 'No'
}

/**
 * List the scores for the current ongoing game.
 * @param {Message} message
 */
module.exports.scores = async (message) => {
  let scoreMessage = ''

  for (const userId in SCORES) {
    const user = await message.guild.members.fetch(userId)

    if (!user) continue

    scoreMessage += `${user.displayName} has received $${SCORES[userId].taken} million so far, accepting \
${Math.floor(SCORES[userId].taken / (SCORES[userId].taken + SCORES[userId].refused) * 100)}% \
of voted scenarios!\n`
  }

  message.channel.send(scoreMessage)
}

/**
 * Adds a condition for the million questions
 * @param {Message} message
 */
module.exports.addCondition = (message) => {
  const condition = message.content.slice(14)

  if (condition.trim() === '') {
    message.reply('You must supply content for a condition to be added.')
    return
  }

  conditions.push(condition)
  fs.appendFileAsync(path.resolve(__dirname, '../data/million', 'userconditions.txt'), `${condition}\n`)
  message.reply(`Added condition ${condition}`)
}

/**
 * Adds a outcome for the millions questions.
 * @param {Message} message
 */
module.exports.addOutcome = (message) => {
  const outcome = message.content.slice(12)

  if (outcome.trim() === '') {
    message.reply('You must supply content for an outcome to be added.')
    return
  }

  outcomes.push(outcome)
  fs.appendFileAsync(path.resolve(__dirname, '../data/million', 'useroutcomes.txt'), `${outcome}\n`)
  message.reply(`added outcome ${outcome}`)
}
