const express = require('express');
const router = express.Router();
const websiteController = require('../controllers/websiteController');
const pingController = require('../controllers/pingController');

router.post('/websites', websiteController.addWebsite);
router.get('/websites', websiteController.getWebsites);
router.delete('/websites/:id', websiteController.deleteWebsite);

router.get('/websites/:id/ping-results', pingController.getPingResults);
router.post('/websites/:id/ping', pingController.triggerPing);

module.exports = router;