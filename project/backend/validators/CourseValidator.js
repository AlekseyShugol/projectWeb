const Joi = require('joi');

const courseSchema = Joi.object({
  user_cource_id: Joi.number().integer().required(),
  price: Joi.number().integer().optional(),
  name: Joi.string().max(100).required(),
});

const validateCourse = (req, res, next) => {
  const { error } = courseSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

module.exports = validateCourse;