const express = require('express');
const router = express.Router();

const authLoginApi = require('./auth.login');

router.post('/login', authLoginApi);

module.exports = router;
