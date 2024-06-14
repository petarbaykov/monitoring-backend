const Endpoint = require('../models/endpoint');
const Metric = require('../models/metric');
const axios = require('axios');
const { performance } = require('perf_hooks');

let intervals = {};

const startMonitoring = (endpoint) => {
  if (intervals[endpoint.id]) {
    clearInterval(intervals[endpoint.id]);
  }

  intervals[endpoint.id] = setInterval(async () => {
    const start = performance.now();
    try {
      const response = await axios({
        method: endpoint.method.toLowerCase(),
        url: endpoint.url
      });
      const end = performance.now();
      const responseTime = Math.round(end - start);
      await Metric.insert({
        endpointId: endpoint.id,
        responseTime,
        statusCode: response.status
      });
    } catch (error) {
      const end = performance.now();
      const responseTime = Math.round(end - start);
      await Metric.insert({
        endpointId: endpoint.id,
        responseTime,
        statusCode: error.response ? error.response.status : 500
      });
    }
  }, endpoint.interval);
};

exports.create = (req, res) => {
  const { url, method, interval } = req.body;
  Endpoint.insert({ userId: req.user.id, url, method, interval })
    .then(endpoint => {
      startMonitoring(endpoint);
      res.status(201).json(endpoint);
    })
    .catch(err => {
      if (err.name === 'SequelizeUniqueConstraintError') {
        res.status(400).json({ error: 'Endpoint already exists' });
      } else {
        res.status(400).json({ error: 'Failed to create endpoint' });
      }
    });
};

exports.getAll = (req, res) => {
  Endpoint.findAll({ where: { userId: req.user.id } })
    .then(endpoints => res.json(endpoints))
    .catch(err => res.status(400).json({ error: err }));
};

exports.update = (req, res) => {
  const { id } = req.params;
  const { url, method, interval } = req.body;
  Endpoint.update({ url, method, interval }, { where: { id, userId: req.user.id } })
    .then(() => {
      return Endpoint.findByPk(id);
    })
    .then(endpoint => {
      startMonitoring(endpoint); // Update the monitoring interval
      res.json({ message: 'Endpoint updated successfully' });
    })
    .catch(err => res.status(400).json({ error: err }));
};

exports.delete = (req, res) => {
  const { id } = req.params;
  Endpoint.destroy({ where: { id, userId: req.user.id } })
    .then(() => {
      if (intervals[id]) {
        clearInterval(intervals[id]);
        delete intervals[id];
      }
      res.json({ message: 'Endpoint deleted successfully' });
    })
    .catch(err => res.status(400).json({ error: err }));
};

exports.startMonitoringAllEndpoints = async () => {
  try {
    const endpoints = await Endpoint.findAll();
    endpoints.forEach(endpoint => {
      startMonitoring(endpoint);
    });
  } catch (err) {
    console.error('Error starting monitoring for all endpoints:', err);
  }
};
