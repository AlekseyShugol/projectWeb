const { Model, DataTypes } = require('sequelize');

class Mark extends Model {
  static associate(models) {
    Mark.belongsTo(models.User, { foreignKey: 'student_id', as: 'student', onDelete: 'CASCADE' });
    Mark.belongsTo(models.User, { foreignKey: 'teacher_id', as: 'teacher', onDelete: 'CASCADE' });
    Mark.belongsTo(models.Lesson, { foreignKey: 'lesson_id', as: 'lesson', onDelete: 'CASCADE' });
  }
}

const initMarkModel = (sequelize) => {
  Mark.init({
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    student_id: {
      type: DataTypes.BIGINT,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    teacher_id: {
      type: DataTypes.BIGINT,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    mark_volume: {
      type: DataTypes.BIGINT,
    },
    lesson_id: {
      type: DataTypes.BIGINT,
      references: {
        model: 'lessons',
        key: 'id',
      },
    },
  }, {
    sequelize,
    modelName: 'Mark',
    tableName: 'marks',
    timestamps: false,
  });

  return Mark;
};

module.exports = { initMarkModel, Mark };