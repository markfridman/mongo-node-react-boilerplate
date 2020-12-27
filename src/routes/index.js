const express = require('express')

const router = express.Router()
const example = require('./example')

router.post('/example', example)

module.exports = router
