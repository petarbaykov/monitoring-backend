const { Model, DataTypes, QueryTypes } = require('sequelize');
const sequelize = require('../config/database');

class Endpoint extends Model {}

Endpoint.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id',
    references: {
      model: 'users',
      key: 'id'
    }
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false
  },
  method: {
    type: DataTypes.STRING,
    allowNull: false
  },
  interval: {
    type: DataTypes.INTEGER,
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
  modelName: 'Endpoint',
  tableName: 'endpoints',
  underscored: true
});

Endpoint.insert = async (params) => {
  return sequelize.query(
    'INSERT INTO endpoints VALUES (NULL, $userId, $url, $method, $interval, NOW(), NOW())', {
        bind: {
          userId: params.userId,
          url: params.url,
          method: params.method,
          interval: params.interval,
        },
        type: QueryTypes.INSERT,
        returning: true,
    }
  );
};

module.exports = Endpoint;
