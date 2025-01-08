const { Model, DataTypes } = require('sequelize');

class UserRole extends Model {
  static associate(models) {
    UserRole.hasMany(models.User, { foreignKey: 'role_id', as: 'users' });
  }
}

const initUserRoleModel = (sequelize) => {
  UserRole.init({
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    role: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'UserRole',
    tableName: 'user_role',
    timestamps: false,
  });

  return UserRole;
};

module.exports = { initUserRoleModel, UserRole };