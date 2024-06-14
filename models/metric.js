const { Model, DataTypes, QueryTypes } = require('sequelize');
const sequelize = require('../config/database');

class Metric extends Model {}

Metric.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  endpointId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'endpoint_id',
    references: {
      model: 'endpoints',
      key: 'id'
    }
  },
  responseTime: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'response_time'
  },
  statusCode: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'status_code'
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
  modelName: 'Metric',
  tableName: 'metrics',
  underscored: true
});

Metric.insert = async (params) => {
  return sequelize.query(
    'INSERT INTO metrics VALUES (NULL, $endpointId, $responseTime, $statusCode, NOW(), NOW())', {
        bind: {
          endpointId: params.endpointId,
          responseTime: params.responseTime,
          statusCode: params.statusCode,
        },
        type: QueryTypes.INSERT,
        returning: true,
    }
  );
};

module.exports = Metric;
