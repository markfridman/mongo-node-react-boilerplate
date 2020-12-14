const Joi = require('joi')

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
  req.log.info({ key },'some log')
  return res.json({ success: true })
}