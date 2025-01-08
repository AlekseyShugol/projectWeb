const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

class User extends Model {
  static associate(models) {
    User.belongsTo(models.UserRole, { foreignKey: 'role_id', as: 'role' });
    User.hasMany(models.UserCourse, { foreignKey: 'user_id', as: 'courses' });
    User.hasMany(models.Lesson, { foreignKey: 'teacher_id', as: 'lessons' });
    User.hasMany(models.Mark, { foreignKey: 'student_id', as: 'marks' });
    User.hasMany(models.Mark, { foreignKey: 'teacher_id', as: 'givenMarks' });
  }

  async checkPassword(password) {
    return await bcrypt.compare(password, this.password);
  }
}

const initUserModel = (sequelize) => {
  User.init({
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    login: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
      set(value) {
        const hashedPassword = bcrypt.hashSync(value, 10);
        this.setDataValue('password', hashedPassword);
      },
    },
    phone: {
      type: DataTypes.BIGINT,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false //change 04.01.25
    },
    role_id: {
      type: DataTypes.BIGINT,
      references: {
        model: 'user_role',
        key: 'id',
      },
    },
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: false,
  });

  return User;
};

module.exports = { initUserModel, User };