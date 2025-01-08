const Joi = require('joi');

const userCourseSchema = Joi.object({
  total_price: Joi.number().integer().optional(),
  user_id: Joi.number().integer().required(),
  cource_id: Joi.number().integer().optional(),
});

const validateUserCourse = (req, res, next) => {
  const { error } = userCourseSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

module.exports = validateUserCourse;