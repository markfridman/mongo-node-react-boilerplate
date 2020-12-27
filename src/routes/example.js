const { json } = require('express')
const Joi = require('joi')
const Examples = require('../models/example')
const schema = Joi.object().keys({
  key: Joi.string().required(),
})

module.exports = async (req, res) => {
  try {
    await schema.validateAsync(req.body)
  } catch (err) {
    req.log.error(`error while validating example schema: ${err.message}`)
    return res.status(400).json({ info: 'validation error' })
  }
  const { key } = req.body
  try {
    req.log.info({ stringify: JSON.stringify(Examples) }, 'creating example in db')
    await Examples.create({
      title: 'String', // String is shorthand for {type: String}
      author: 'String',
      body: 'String',
      comments: [{ body: 'String', date: Date.now() }],
      hidden: false,
      meta: {
        votes: 1,
        favs: 3,
      }
    })
    req.log.info('after')

  } catch (e) {
    req.log.error({ message: e.message }, 'could not create example')
  }
  return res.json({ success: true })
}