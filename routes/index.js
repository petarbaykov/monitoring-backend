const express = require('express');
const userController = require('../controllers/userController');
const endpointController = require('../controllers/endpointController');
const metricController = require('../controllers/metricController');
const isAuthenticated = require('../middleware/isAuthenticated');
const router = express.Router();

// User routes
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/logout', userController.logout);
router.get('/me', isAuthenticated, userController.getCurrentUser);

// Endpoint routes (protected)
router.use(isAuthenticated);
router.post('/endpoints', endpointController.create);
router.get('/endpoints', endpointController.getAll);
router.put('/endpoints/:id', endpointController.update);
router.delete('/endpoints/:id', endpointController.delete);
router.get('/metrics/:endpointId/last24hours', isAuthenticated, metricController.getMetricsForLast24Hours);


module.exports = router;
