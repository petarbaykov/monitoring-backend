// models/endpoint.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Endpoint = sequelize.define('Endpoint', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false
  },
  method: {
    type: DataTypes.ENUM('GET', 'POST'),
    allowNull: false
  },
  interval: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  timestamps: true,
  underscored: true,
  tableName: 'endpoints',
  initialAutoIncrement: 1,
});

module.exports = Endpoint;
