const httpError = require('http-errors');

const jwtService = require('../service/jwt.service');
const config = require('../config');

async function controller(req, res, next) {
  const { username, password } = req.body;

  if (!username || !password) {
    next(new httpError.BadRequest('Username or password missing'));
    return;
  }
	console.log(username, config.ABC, password, config.PASSWORD, username.length, config.ABC.length, password.length, config.PASSWORD.length);
  if (username !== config.ABC || password !== config.PASSWORD) {
    next(new httpError.BadRequest('username or password does not match'));
    return;
  }

  const token = jwtService.createToken({ username });

  res.cookie('token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
  });

  return res.json({
    success: true,
    message: 'login successfully',
  });
}

module.exports = controller;
