const Metric = require('../models/metric');
const { Sequelize } = require('sequelize');

exports.getMetricsForLast24Hours = async (req, res) => {
  const { endpointId } = req.params;

  try {
    const metrics = await Metric.findAll({
      where: {
        endpointId,
        createdAt: {
          [Sequelize.Op.gte]: new Date(new Date() - 24 * 60 * 60 * 1000)
        }
      },
      attributes: [
        [Sequelize.fn('DATE_FORMAT', Sequelize.col('created_at'), '%Y-%m-%d %H:00:00'), 'hour'],
        [Sequelize.fn('COUNT', Sequelize.col('status_code')), 'count'],
        [Sequelize.fn('AVG', Sequelize.col('response_time')), 'averageResponseTime']
      ],
      group: [Sequelize.fn('DATE_FORMAT', Sequelize.col('created_at'), '%Y-%m-%d %H:00:00')],
      order: [[Sequelize.fn('DATE_FORMAT', Sequelize.col('created_at'), '%Y-%m-%d %H:00:00'), 'ASC']]
    });

    res.json(metrics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
