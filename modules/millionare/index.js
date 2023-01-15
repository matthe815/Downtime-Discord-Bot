const GameHandler = require('./GameHandler.js')
const ScoreHandler = require('./ScoreHandler.js')
const keys = require('../../util/keys')
const { EmbedBuilder } = require('discord.js')

// Start a brand new game, this will over write the previous game and write whatever scores
module.exports.startGame = async (client) => {
  // Write the scores of the last game (if they are any) and start a new one
  ScoreHandler.write(GameHandler.get())
  await GameHandler.make()

  const channel = await client.channels.fetch(keys.DISCORD.GAMECHANNEL)

  channel.send({
    content: GameHandler.get().question,
    components: [
      {
        type: 1,
        components: GameHandler.get().answers.map((answer) => {
          return {
            type: 2,
            label: answer.replace(/&amp;/g, '&'),
            style: 1,
            custom_id: GameHandler.get().answers.indexOf(answer).toString()
          }
        })
      }
    ]
  })
}

// Get the scores for all of the players
module.exports.scores = async (interaction) => {
  const scores = ScoreHandler.get()
  const itemizedScores = Object.entries(scores).sort((a, b) => b[1] - a[1])
  const finalScores = []

  for (const score of itemizedScores) {
    const user = await interaction.guild.members.fetch(score[0])

    // Get the score and name, the score will display $0 if you have no money, other wise it's in the format $100, $1000, $10000, etc.
    finalScores.push([user.displayName, score[1] === 0 ? '$0' : `$1${'0'.repeat(score[1])}`])
  }

  // create a rich embed with the top 10 as fields
  const embed = new EmbedBuilder()
    .setTitle('Millionaire Leaderboard')
    .addFields(
      finalScores.map((score) => {
        return {
          name: score[0],
          value: score[1]
        }
      }))

  interaction.reply({ embeds: [embed] })
}

module.exports.scores.command = {
  name: 'millionaire',
  description: 'Get the top 10 richest people in the server'
}

// This is called when a user answers a question
module.exports.handleResponse = async (interaction) => {
  if (GameHandler.get().players[interaction.member.id]) return interaction.reply({ content: 'You have already answered this question!', ephemeral: true })
  GameHandler.get().players[interaction.member.id] = interaction.customId

  await interaction.reply({
    // give the answer, if they were correct, and the correct answer
    content: `You answered '${GameHandler.get().answers[parseInt(interaction.customId)]}' ${GameHandler.get().correct === parseInt(interaction.customId)
      ? 'correctly!'
      : `incorrectly! The correct answer was '${GameHandler.get().answers[GameHandler.get().correct]}'`}`,
    ephemeral: true
  })

  interaction.followUp({
    // say who said what
    content: `${interaction.member.displayName} answered '${GameHandler.get().answers[parseInt(interaction.customId)]}'`
  })

  // Write an individual score
  ScoreHandler.writeIndividual(
    GameHandler.get(),
    GameHandler.get().correct === parseInt(interaction.customId),
    interaction.member.id
  )
}
