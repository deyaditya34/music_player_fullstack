const httpError = require('http-errors');

const jwtService = require('../service/jwt.service');
const config = require('../config');

function userResolver(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    next(new httpError.Forbidden('Access Denied'));
    return;
  }

  const { username } = jwtService.decodeToken(token);
  if (username !== config.ABC) {
    next(new httpError.Unauthorized('Invalid token'));
    return;
  }

  next();
}

module.exports = userResolver;
