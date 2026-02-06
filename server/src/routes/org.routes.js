const router = require('express').Router();
const auth = require('../middlewares/auth');
const role = require('../middlewares/role');
const orgScope = require('../middlewares/orgScope');
const controller = require('../modules/orgs/org.controller');

// Create organization
router.post('/create', auth, controller.createOrg);

router.get('/invite/:token', controller.validateInvite);
router.post('/invite/accept', controller.acceptInvite);

// Invite user
router.post(
  '/invite',
  auth,
  orgScope,
  role(['OWNER', 'ADMIN']),
  controller.inviteUser
);

module.exports = router;
