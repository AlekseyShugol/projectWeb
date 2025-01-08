const { Model, DataTypes } = require('sequelize');

class Lesson extends Model {
  static associate(models) {
    Lesson.belongsTo(models.Course, { foreignKey: 'course_id', as: 'course' });
    Lesson.belongsTo(models.User, { foreignKey: 'teacher_id', as: 'teacher' });
    Lesson.hasMany(models.Mark, { foreignKey: 'lesson_id', as: 'marks' });
  }
}

const initLessonModel = (sequelize) => {
  Lesson.init({
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    course_id: {
      type: DataTypes.BIGINT,
      references: {
        model: 'course',
        key: 'id',
      },
    },
    curriculum_id: {
      type: DataTypes.BIGINT,
    },
    start_time: {
      type: DataTypes.TIME,
    },
    end_time: {
      type: DataTypes.INTEGER,
    },
    teacher_id: {
      type: DataTypes.BIGINT,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    position: {
      type: DataTypes.BIGINT,
    },
  }, {
    sequelize,
    modelName: 'Lesson',
    tableName: 'lessons',
    timestamps: false,
  });

  return Lesson;
};

module.exports = { initLessonModel, Lesson };