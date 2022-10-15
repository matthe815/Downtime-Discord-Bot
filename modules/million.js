const path    = require('path')
const fs      = require('fs')
const yaml    = require('js-yaml')

let conditions = []
let outcomes = []
const SCORESFILE = path.resolve(__dirname, '../data/million/userscores.txt')
const SCORES = yaml.load(fs.readFileSync(SCORESFILE, 'utf8')) || {}
const conditionFiles = ['conditions.txt', 'userconditions.txt']
const outcomeFiles = ['outcomes.txt', 'useroutcomes.txt']

let inRound = false
let roundResults = {}
let currentQ = ""

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

function writeScores(){
  for (let user in roundResults) {
    SCORES[user] = SCORES[user] || { taken: 0, refused: 0 }
    if (roundResults[user] === "Yes"){
      SCORES[user].taken++
    } else {
      SCORES[user].refused++
    }
  }
  fs.writeFile(SCORESFILE, yaml.safeDump(SCORES))
  roundResults = {}
}

function endRound(message){
  inRound = false
  let resultsStr = ""
  for (let userId in roundResults) {
    resultsStr += `${message.guild.members.find('id', userId)}: ${roundResults[userId]}\n`
  }

  message.channel.send(`The round is over! Here were the votes for '${currentQ}':\n${resultsStr}`)
  writeScores()
}

module.exports.question = function(message){
  if (message.channel.type !== 'dm' && !inRound) {
    inRound = true
    setTimeout(() => {endRound(message)}, 90000)

    currentQ = produceQuestion()
    message.channel.send(currentQ)
    message.channel.send("This is the scenario for the current round! Please vote using '>yes' or '>no' now!")
  } else if (inRound) {
    message.channel.send(`We're still open for voting! I will post when this round is over. The current scenario is: ${currentQ}`)
  } else {
    message.channel.send(produceQuestion())
  }
}

module.exports.yes = function(message){
  if (inRound) roundResults[message.author.id] = "Yes"
}

module.exports.no = function(message){
  if (inRound) roundResults[message.author.id] = "No"
}

module.exports.scores = function(message){
  let scoreMessage = ""

  for (let userId in SCORES) {
    const user = message.guild.members.find('id', userId)
    scoreMessage += `${user.displayName} has received $${SCORES[userId].taken} million so far, accepting \
${Math.floor(SCORES[userId].taken / (SCORES[userId].taken + SCORES[userId].refused) * 100)}% \
of voted scenarios!\n`
  }

  message.channel.send(scoreMessage)
}

module.exports.addCondition = function(message){
  const condition = message.content.slice(14)
  conditions.push(condition)
  fs.appendFile(path.resolve(__dirname, '../data/million', 'userconditions.txt'), `${condition}\n`)
  message.reply(`added condition ${condition}`)
}

module.exports.addOutcome = function(message){
  const outcome = message.content.slice(12)
  outcomes.push(outcome)
  fs.appendFile(path.resolve(__dirname, '../data/million', 'useroutcomes.txt'), `${outcome}\n`)
  message.reply(`added outcome ${outcome}`)
}