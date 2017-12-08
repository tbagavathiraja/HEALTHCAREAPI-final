var apiResponseConstant = require("../utilities/constant/apiresponseconstant");

exports.allowCrossDomain = function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
};

exports.handleError = function(err, req, res, next) {
  res.status(err.status || 500).end(err.message || 'Uh-oh. Something went wrong.');
};

exports.sendUnauthorizedRequest = function(res, err) {
  log.warn('Unauthorized request made.', err);
  res.status(401).end(err ? err.toString() : null);
};
