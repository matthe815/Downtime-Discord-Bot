const path = require('path')
const fs = require('fs')
const yaml = require('js-yaml')
const { EmbedBuilder } = require('discord.js')

const SCORESFILE = path.resolve(__dirname, '../../data/million/userscores.txt')
const SCORES = yaml.load(fs.readFileSync(SCORESFILE, 'utf8')) || {}

/**
 * Write all scores to the YAML file.
 */
module.exports.write = (roundResults) => {
  for (const user in roundResults) {
    SCORES[user] = SCORES[user] || { taken: 0, refused: 0 }

    switch (roundResults[user]) {
      case 'Yes':
        SCORES[user].taken++
        break
      case 'No':
        SCORES[user].refused++
        break
    }
  }

  fs.writeFileSync(SCORESFILE, yaml.dump(SCORES))
  roundResults = {}
}

module.exports.get = () => SCORES

/**
 * List the scores for the current ongoing game.
 * @param {Message} message
 */
module.exports.scores = async (interaction) => {
  const scoreMessages = []

  for (const userId in this.get()) {
    if (!/[0-9]{18,}/g.test(userId)) continue // Skip if not a valid user ID
    const user = await interaction.guild.members.fetch(userId)

    if (!user) continue

    // Pushes the scores to a map for sorting or other rendering trickery.
    scoreMessages.push({
      name: user.displayName,
      value: {
        taken: this.get()[userId].taken,
        refused: this.get()[userId].refused,
        total: Math.floor(this.get()[userId].taken / (this.get()[userId].taken + this.get()[userId].refused) * 100)
      }
    })
  }

  // get sort argument
  let sort = interaction.options.get('sort')?.value
  // if no sort argument, default to wealth
  if (!sort) sort = 'wealth'

  // sort by specified argument
  if (sort) {
    switch (sort) {
      case 'wealth':
        scoreMessages.sort((a, b) => b.value.taken - a.value.taken)
        break
      case 'acceptance':
        scoreMessages.sort((a, b) => b.value.total - a.value.total)
        break
    }
  }

  const embed = new EmbedBuilder()
    .setTitle(`Scores (By ${sort === 'wealth' ? 'Wealth' : 'Acceptance Rate'})`)
    .addFields(scoreMessages.map((message) => ({
      name: message.name,
      value: `received $${message.value.taken} million so far, accepting \
          ${message.value.total}% \
          of voted scenarios!\n`
    })))

  interaction.reply({ embeds: [embed] })
}

module.exports.scores.command = {
  name: 'wealth',
  description: 'Displays the scores of every player',
  // sorting option
  options: [
    {
      name: 'sort',
      description: 'Sort the scores by a certain metric',
      type: 3,
      required: false,
      choices: [
        {
          name: 'Wealth',
          value: 'wealth'
        },
        {
          name: 'Acceptance Rate',
          value: 'acceptance'
        }
      ]
    }
  ]
}
