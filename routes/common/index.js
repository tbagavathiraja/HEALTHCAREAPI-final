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

    return authenticate(data)
      .then(function (result) {
        return res.send(result).end('')
      }).catch(function (err) {
        res.end(err.message);
      })
  }
}

function authenticate (data) {
  var deferred = q.defer()
  console.log(data.password)
  var userObject
  var addSessionDetails
  dbConnection.getConnection(false, function (err, connection) {
    data.password = utility.hashPassword(data.password)
    console.log('calling')
    return userModel.authenticate(connection, data)
      .then(function (user) {
        userObject = user
        console.log('user : ' + user.length)
        // Check if data present
        if (!user || user === null || user.length == 0) {
          throw Error('INVALID_CREDENTIALS')
        }
        else {
          console.log('ELSEs')
          user_type = user.role_type_name;
          var token = utility.hashPassword(user.user_id + utility.current_datetime())
          addSessionDetails = {
            session_auth_token: token,
            expiry_time: utility.add_minute_current_datetime(5),
            user_id: user.user_id
          }
        }
        return sessionModel.addSession(connection, addSessionDetails)
      })
      .then(function (session) {
        let userInfo = []
        userInfo.push(userObject)
        userInfo.push(addSessionDetails)
        console.log('THEM')
        return deferred.resolve(userInfo)
      })
      .catch(function (error) {
        console.log(error.message)
        return deferred.reject(error)
      })
  })
  return deferred.promise
}

router.post('/login', login.authenticateUser)
module.exports = router