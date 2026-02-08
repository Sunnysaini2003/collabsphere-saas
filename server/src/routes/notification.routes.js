const router = require('express').Router();
const auth = require('../middlewares/auth');
const controller = require('../modules/notifications/notification.controller');

router.get('/', auth, controller.getNotifications);

module.exports = router;
