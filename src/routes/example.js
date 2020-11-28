const Joi = require('joi')

const schema = Joi.object().keys({
  key: Joi.string().required(),
})

module.exports = async (req, res) => {
  try {
    await schema.validateAsync()
  } catch (err) {
    logger.error({ err }, 'error while validating example schema')
    return res.status(400).json({ info: 'validation error' })
  }
  req.log.info('sdfsdf')
  const { key } = req.body
  return res.json({ success: true })
}