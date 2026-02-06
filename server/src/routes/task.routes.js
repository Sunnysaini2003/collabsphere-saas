const router = require('express').Router();
const auth = require('../middlewares/auth');
const orgScope = require('../middlewares/orgScope');
const controller = require('../modules/projects/task.controller');

router.post('/', auth, orgScope, controller.createTask);
router.get('/:projectId', auth, orgScope, controller.getTasks);
router.patch('/:taskId/status', auth, orgScope, controller.updateTaskStatus);

module.exports = router;
