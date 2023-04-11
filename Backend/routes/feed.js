const express = require('express');
const { body } = require('express-validator/check');

const feedController = require('../controllers/feed');
const isAuth = require('../middleware/is-auth');
const router = express.Router();

router.get('/users', feedController.getUsers);
router.post('/get-public-key', feedController.getPublicKey);
router.post('/conversation-data', feedController.getConversationData);
router.post('/send-message', isAuth,feedController.createMessage);
module.exports = router;
