const request = require('request')
const QUESTION_DB_API = 'https://opentdb.com/api.php?amount=1'

let currentGame = null

module.exports.make = async () => {
  return new Promise((resolve, reject) => {
    request(QUESTION_DB_API, (req, response, body) => {
      const data = JSON.parse(body)

      if (data.response_code === 0) {
        let question = data.results[0].question

        question = question.replace(/&#039;/g, '\'')
        question = question.replace(/&quot;/g, '"')

        const answers = data.results[0].incorrect_answers
        answers.push(data.results[0].correct_answer)
        answers.sort(() => Math.random() - 0.5)

        // Get the correct answer
        const correct = answers.indexOf(data.results[0].correct_answer)

        currentGame = {
          question,
          correct,
          answers,
          players: {}
        }

        return resolve()
      }

      return reject(new Error('Could not get a question from the API'))
    })
  })
}

module.exports.get = () => currentGame
