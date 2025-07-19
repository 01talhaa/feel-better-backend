const express = require('express');
const router = express.Router();
const controller = require('./therapist.controller');

router.post('/', controller.createTherapistProfile);
router.get('/', controller.getAllTherapists);
// A good way to get a specific profile is by the user ID it belongs to
router.get('/user/:userId', controller.getTherapistByUserId);

module.exports = router;