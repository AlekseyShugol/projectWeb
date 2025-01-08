const Joi = require('joi');

const markSchema = Joi.object({
  student_id: Joi.number().integer().required(),
  teacher_id: Joi.number().integer().required(),
  mark_volume: Joi.number().integer().optional(),
  lesson_id: Joi.number().integer().required(),
});

const validateMark = (req, res, next) => {
  const { error } = markSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

module.exports = validateMark;