const request = require('request')
const packageFile = require('../package.json')
const VERSION_FILE = 'https://raw.githubusercontent.com/Downtime-Discord/Downtime-Discord-Bot/master/package.json'

module.exports.checkVersion = async () => {
  return new Promise((resolve, reject) => {
    request(VERSION_FILE, (req, response, body) => {
      const data = JSON.parse(body)

      if (data.version) {
        return resolve(data.version)
      }

      return reject(new Error('Could not get a version from the API'))
    })
  })
}

module.exports.runUpdateCheck = async (client) => {
  const version = await module.exports.checkVersion()

  if (version !== packageFile.version) {
    client.logger.info(`New version available: ${version}`)
    client.logger.info(`Current version: ${packageFile.version}`)
    client.logger.info('Please update your bot!')
  }
}
