const { Model, DataTypes, QueryTypes } = require('sequelize');
const sequelize = require('../config/database');

class User extends Model {
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'created_at'
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'updated_at'
  }
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users',
  underscored: true
});

User.insert = async (params) => {
  return sequelize.query(
    'INSERT INTO users VALUES (NULL, $username, $password, NOW(), NOW())', {
        bind: {
          username: params.username,
          password: params.password,
        },
        type: QueryTypes.INSERT,
        returning: true,
    }
  );
};

module.exports = User;
