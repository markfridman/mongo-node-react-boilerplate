const mongoose = require('mongoose')
/* eslint-disable no-console */

const { MONGO_URI } = require('../consts')

module.exports = class db {
  constructor() {
    this.db = null
    this.attempts = 0
    console.log(MONGO_URI)
  }

  initialize() {
    const options = {
      useNewUrlParser: true,
      useCreateIndex: true,
      reconnectTries: 24 * 60 * 60,
      poolSize: 100,
      bufferCommands: false,
    }
    return new Promise((resolve) => {
      mongoose.Promise = global.Promise
      mongoose.connect(
        MONGO_URI,
        options, (err) => {
          if (err) {
            if (this.attempts < 5) {
              this.attempts += 1
              console.error('failed to connect to mongo on startup - retrying in 5 sec', err.message)
              setTimeout(this.initialize(), 5000)
            } else {
              console.error('db connection failed 5 times, exiting')
              process.exit(1)
            }
          }
        },
      )
      this.db = mongoose.connection
      this.db.on('error', console.error.bind(console, 'connection error:'))
      this.db.once('open', () => {
        console.log('connected successfully to', this.db.name, 'db')
        resolve()
      })
    })
  }

  disconnect() {
    mongoose.disconnect()
    this.db = null
  }
}
