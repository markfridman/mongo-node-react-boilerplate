const path = require('path')

require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const listEndpoints = require('express-list-endpoints')

const db = require('./src/database/index')
const api = require('./src/routes')
const {
  PORT, LOCAL_DEV
} = require('./src/consts')

const cors = (app) => {
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With')
    res.header('Access-Control-Allow-Credentials', 'true')
    next()
  })
}

const basicPino = require('pino')
const basicPinoLogger = basicPino({ prettyPrint: true })
const expressPino = require('express-pino-logger')({
  logger: basicPinoLogger,
  autoLogging: false,
  serializers: {
    req: (req) => ({
      id: req.id,
      method: req.method,
      url: req.url,
      body: req.body
    })
  },
  customAttributeKeys: {
    req: 'request',
    res: 'response',
    err: 'error',
    responseTime: 'timeTaken'
  },
})

const routes = (app) => {
  app.use('/', express.static(path.join(__dirname, 'client/build')))

  app.get('/healthz', (req, res) => {
    req.log.info('OK')
    res.sendStatus(200)
  })

  app.use('/api', api)

  app.get('*', (req, res) => {
    res.sendStatus(404)
  })
}

const bootstrap = (async () => {
  const app = express()
  app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }))
  app.use(bodyParser.json({ extended: true, limit: '50mb' }))
  app.use(expressPino)


  if (LOCAL_DEV) {
    await cors(app)
    // morgan(app)
  }
  await routes(app)

  app.use((err, req, res, next) => {
    req.log.error(err)
    return next()
  })

  await db.initialize()

  app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
  })
  console.log(listEndpoints(app))
})

bootstrap()

process.on('uncaughtException', (error) => {
  console.error({ error }, 'uncaughtException')
  process.exit(1)
})

process.on('unhandledRejection', (reason, p) => {
  console.error('unhandledRejection', { reason, p })
  process.exit(1)
})

process.on('SIGINT', () => {
  process.exit()
})