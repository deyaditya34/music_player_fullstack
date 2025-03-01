const jwt = require('jsonwebtoken');

function createToken(payload) {
  const token = jwt.sign(payload, "jwt");

  return token;
}

function decodeToken(token) {
  try {
    return jwt.verify(token, "jwt");
  } catch (err) {
    console.log('invalid token -', token);
    return null;
  }
}

module.exports = {
    createToken,
    decodeToken
}
