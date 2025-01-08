const Joi = require('joi');

const lessonSchema = Joi.object({
  course_id: Joi.number().integer().required(),
  curriculum_id: Joi.number().integer().optional(),
  start_time: Joi.date().required(), 
  end_time: Joi.number().integer().optional(),
  teacher_id: Joi.number().integer().required(),
  position: Joi.number().integer().optional(),
});

const validateLesson = (req, res, next) => {
  const { error } = lessonSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

module.exports = validateLesson;