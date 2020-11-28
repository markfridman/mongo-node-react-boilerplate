const express = require('express')

const router = express.Router()
const example = require('./example')

router.post('/example', example)
// const { initialize } = require('./initialize')
// router.get('/initialize', initialize)

module.exports = router
