const express = require('express');
const { login, startingApp, createUser } = require('../controllers/user');
const { auth, authRole } = require('../middleware/auth');
const router = express.Router();

router.post('/users/login', login);
router.post('/users/createuser/:role', auth, authRole, createUser);
module.exports = router;
