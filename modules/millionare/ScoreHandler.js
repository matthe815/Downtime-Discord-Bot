const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')

// Automatically generate the high score files if they don't exist
fs.existsSync(path.resolve(__dirname, '../../data/million/millonare.txt')) || fs.writeFileSync(path.resolve(__dirname, '../../data/million/millonare.txt'))

const SCORESFILE = path.resolve(__dirname, '../../data/million/millionare.txt')
const SCORES = yaml.load(fs.readFileSync(SCORESFILE, 'utf8')) || {}

module.exports.write = (game) => {
  if (!game) return

  Object.entries(game.players).forEach((player) => {
    if (!SCORES[player[0]]) SCORES[player[0]] = 0
    SCORES[player[0]] += player[1]
  })

  fs.writeFileSync(SCORESFILE, yaml.dump(SCORES))
}

module.exports.writeIndividual = (game, wasCorrect, player) => {
  if (!game) return

  if (!SCORES[player]) SCORES[player] = 0

  if (wasCorrect) SCORES[player] += 1
  else SCORES[player] = 0

  fs.writeFileSync(SCORESFILE, yaml.dump(SCORES))
}

module.exports.get = () => SCORES
