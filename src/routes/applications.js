const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applications');

router.get('/', applicationController.getAllApplications);
router.get('/:id', applicationController.getApplicationById);
router.post('/', applicationController.createApplication);
router.put('/:id', applicationController.updateApplication);
router.delete('/:id', applicationController.deleteApplication);

module.exports = router;