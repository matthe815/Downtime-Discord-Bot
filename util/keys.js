const yaml    = require('js-yaml')
const fs      = require('fs')
const path    = require('path')

function keys(){
  try {
    return fs.readFileSync(
      path.resolve(__dirname, '../keys.yml')
    )
  } catch(e) {
    console.log("Failed to load keys")
    throw e
  }
}


const KEYS = yaml.load(keys())

module.exports = KEYS