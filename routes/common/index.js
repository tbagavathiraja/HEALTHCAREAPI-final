var baseDir = process.cwd()
var sessionModel = require(baseDir + '/models/session/session')
var express = require('express')
var router = express.Router()
var dbConnection = require(baseDir + '/services/mysql')
const q = require('q')
var utility = require(baseDir + '/utilities/utilityMethods')
var login = {

  authenticateUser: function (req, res) {
    console.log('Authenticating user')
    var data = req.body
    res.setHeader('content-type', 'application/json');
    return authenticate(data)
      .then(function (result) {
        return res.end(JSON.stringify(result));
      }).catch(function (err) {
        res.end(JSON.stringify(err));
      })
  }
}

function authenticate (data) {
  var deferred = q.defer()
  console.log(data.password)
  var userObject;
  var addSessionDetails;
  dbConnection.getConnection(false, function (err, connection) {
    data.password = utility.hashPassword(data.password)
    return userModel.authenticate(connection, data)
      .then(function (user) {
        userObject = user[0]

        console.log("AUTH METHOD")
        console.log('user : ' + JSON.stringify(user))
        // Check if data present

        if (!user || user === null||user===undefined||JSON.stringify(user).length===2) {
          throw Error('INVALID_CREDENTIALS')
        }
        else {
          role_type_name = user.role_type_name;
          var token = utility.hashPassword(user.user_id + utility.current_datetime())
          addSessionDetails = {
            session_auth_token: token,
            expiry_time: utility.add_minute_current_datetime(5),
            user_id: user.user_id
          }
          userObject. session_auth_token=token;
          userObject.expiry_time=addSessionDetails.expiry_time;
        }
        return sessionModel.addSession(connection, addSessionDetails)
      })
      .then(function (session) {
        userObject.status="success";
        console.log(JSON.stringify(userObject));
        return deferred.resolve(userObject)
      })
      .catch(function (error) {
        console.log(error.message)
        return deferred.reject(error)
      })
  })
  return deferred.promise
}

router.post('/authenticate', login.authenticateUser)
module.exports = router