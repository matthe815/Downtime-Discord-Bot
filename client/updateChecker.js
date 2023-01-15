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

module.exports.runUpdateCheck = async () => {
  const version = await module.exports.checkVersion()

  if (version !== packageFile.version) {
    console.warn(`New version available: ${version}`)
    console.warn(`Current version: ${packageFile.version}`)
    console.warn('Please update your bot!')
  }
}
