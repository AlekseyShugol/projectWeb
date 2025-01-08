const { Model, DataTypes } = require('sequelize');

class Course extends Model {
  static associate(models) {
    Course.belongsTo(models.UserCourse, { foreignKey: 'user_cource_id', as: 'userCourse' });
    Course.hasMany(models.Lesson, { foreignKey: 'course_id', as: 'lessons' });
  }
}

const initCourseModel = (sequelize) => {
  Course.init({
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    user_cource_id: {
      type: DataTypes.BIGINT,
      references: {
        model: 'user_cources',
        key: 'id',
      },
    },
    price: {
      type: DataTypes.BIGINT,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Course',
    tableName: 'course',
    timestamps: false,
  });

  return Course;
};

module.exports = { initCourseModel, Course };