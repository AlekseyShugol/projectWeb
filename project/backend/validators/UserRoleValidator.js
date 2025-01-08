const Joi = require('joi');

const userRoleSchema = Joi.object({
  role: Joi.string().max(100).required(),
});

const validateUserRole = (req, res, next) => {
  const { error } = userRoleSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

module.exports = validateUserRole;