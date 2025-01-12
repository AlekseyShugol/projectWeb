const { Lesson } = require('../models/Lesson');
const markRepository = require('../repositories/MarkRepository'); // Импортируйте репозиторий марок

class LessonRepository {
  async findAll() {
    return await Lesson.findAll();
  }

  async findById(id) {
    return await Lesson.findByPk(id);
  }

  async create(data) {
    return await Lesson.create(data);
  }

  async update(id, data) {
    const lesson = await Lesson.findByPk(id);
    if (lesson) {
      return await lesson.update(data);
    }
    return null;
  }

  // Новый метод для получения всех уроков по ID курса
  async findAllByCourseId(courseId) {
    return await Lesson.findAll({ where: { course_id: courseId } });
  }

  // Метод для удаления урока и его оценок
  async deleteLessonWithMarks(lessonId) {
    await markRepository.deleteByLessonId(lessonId);

    const lesson = await Lesson.findByPk(lessonId);
    if (lesson) {
      await lesson.destroy();
      return true;
    }
    return false;
  }
}

module.exports = new LessonRepository();