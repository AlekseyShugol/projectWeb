const { Model, DataTypes } = require('sequelize');

class UserCourse extends Model {
  static associate(models) {
    UserCourse.belongsTo(models.User, { foreignKey: 'user_id', as: 'user', onDelete: 'CASCADE' });
    UserCourse.hasMany(models.Course, { foreignKey: 'user_cource_id', as: 'courses', onDelete: 'CASCADE' });
  }
}

const initUserCourseModel = (sequelize) => {
  UserCourse.init({
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    total_price: {
      type: DataTypes.BIGINT,
    },
    user_id: {
      type: DataTypes.BIGINT,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    cource_id: {
      type: DataTypes.BIGINT,
    },
  }, {
    sequelize,
    modelName: 'UserCourse',
    tableName: 'user_cources',
    timestamps: false,
  });

  return UserCourse;
};

module.exports = { initUserCourseModel, UserCourse };