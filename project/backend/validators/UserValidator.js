const Joi = require('joi');

const userSchema = Joi.object({
  login: Joi.string().max(100).required(),
  password: Joi.string().max(100).required(),
  phone: Joi.number().integer().optional(),
  email: Joi.string().email().max(100).optional(),
  role_id: Joi.number().integer().optional(),
});

const validateUser = (req, res, next) => {
  const { error } = userSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

module.exports = validateUser;