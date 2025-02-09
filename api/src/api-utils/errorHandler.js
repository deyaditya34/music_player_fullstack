const httpError = require('http-errors');

function errorHandler(err, req, res, next) {
  console.log(`[api error]: ${err}`);

  res.status(getErrorStatusCode(err)).json({
    success: false,
    message: getErrorMessage(err),
  });
}

function getErrorStatusCode(err) {
  return err.statusCode || httpError.InternalServerError().statusCode;
}

function getErrorMessage(err) {
  return err.message || httpError.InternalServerError().message;
}

module.exports = errorHandler;
