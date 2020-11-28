const {
  MONGO_PORT,
  DEV,
  PORT,
  AUTH,
  MONGO_HOST,
  MONGO_DB_NAME,
} = process.env

const LOCAL_DEV = DEV ? DEV === 'true' : false
let MONGO_URI = MONGO_PORT ? `mongodb://${AUTH || ''}${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB_NAME || ''}` : `mongodb://${AUTH || ''}${MONGO_HOST}/${MONGO_DB_NAME || ''}`

module.exports = {
  MONGO_URI,
  LOCAL_DEV,
  PORT
}
