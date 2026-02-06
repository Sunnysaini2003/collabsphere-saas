const router = require('express').Router();
const auth = require('../middlewares/auth');
const orgScope = require('../middlewares/orgScope');
const controller = require('../modules/projects/project.controller');

router.post('/', auth, orgScope, controller.createProject);
router.get('/', auth, orgScope, controller.getProjects);

module.exports = router;
