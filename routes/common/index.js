var baseDir = process.cwd()
var sessionModel = require(baseDir + '/models/session/session')
var express = require('express')
var router = express.Router()
var dbConnection = require(baseDir + '/services/mysql')
const q = require('q')
var utility = require(baseDir + '/utilities/utilityMethods')
var userModel = require(baseDir + '/models/users/user')
var email=require(baseDir+'/services/email')
var commonConstants=require(baseDir+'/utilities/commonConstants.js')
var services = {

  authenticateUser: function (req, res) {

    var data = req.body
    console.log('Authenticating user'+JSON.stringify(data))
    res.setHeader('content-type', 'application/json')
    return authenticate(data)
      .then(function (result) {
        return res.end(JSON.stringify(result))
      }).catch(function (err) {
        res.send(JSON.stringify(err))
      })
  },

  resetPassword: function (req, res) {
    var data = req.body
    res.setHeader('content-type', 'application/json')
    return sendResetLink(data)
      .then(function (result) {
        return res.end(JSON.stringify(result))
      }).catch(function (err) {
        res.send(JSON.stringify(err))
      })
  },

}

function sendResetLink (data) {
  var deferred = q.defer()
  console.log('verifying mail id...')
  dbConnection.getConnection(false, function (err, connection) {
    try {
      if (err) {
        throw ('DB ERROR OCCURED'+err)
      }else{
        userModel.verifyUser(connection,data)
          .then(function(user){
            if (!user || user === null || user === undefined || JSON.stringify(user).length === 2) {
              throw Error('INVALID_CREDENTIALS')
            } else {
              user=user[0];
              var token = utility.hashPassword(user.user_id + utility.current_datetime());
              var passwordResetLink=commonConstants.commonConstants.PASSWORD_RESET_LINK+token;
              user.reset_link=passwordResetLink;
              user.token=token;
              user.expiry_time=utility.add_minute_current_datetime(5);
              userModel.trackResetPassword(connection,user)
                .then(function (result) {
                  console.log("in generating")
                  email.resetPassword(user)

                })


            }
          })


      }
    }catch (err){
      deferred.reject(err);
    }
  })
return deferred.promise;
}

function authenticate (data) {
  var deferred = q.defer()
  console.log(data.password)
  var userObject
  var addSessionDetails
  dbConnection.getConnection(false, function (err, connection) {
    try {
      if (err) {
        console.log(err)
        throw ('DB ERROR OCCURED'+err)
      } else {
        data.password = utility.hashPassword(data.password)
        return userModel.authenticate(connection, data)
          .then(function (user) {
            userObject = user[0]
            console.log('AUTH METHOD')
            console.log('user : ' + JSON.stringify(user))
            // Check if data present

            if (!user || user === null || user === undefined || JSON.stringify(user).length === 2) {
              throw Error('INVALID_CREDENTIALS')
            }
            else {
              role_type_name = user.role_type_name
              var token = utility.hashPassword(user.user_id + utility.current_datetime())
              addSessionDetails = {
                session_auth_token: token,
                expiry_time: utility.add_minute_current_datetime(5),
                user_id: user.user_id
              }
              userObject.session_auth_token = token
              userObject.expiry_time = addSessionDetails.expiry_time
            }
            return sessionModel.addSession(connection, addSessionDetails)
          })
          .then(function (session) {
            userObject.status = 'success'
            console.log(JSON.stringify(userObject))
            return deferred.resolve(userObject)
          })
          .catch(function (error) {
            console.log('HERE' + error.message)
            let err = {
              'Error': error.message
            }
            return deferred.reject(err)
          })
      }
    }
    catch (err) {
      deferred.reject(err)
    }

  })

  return deferred.promise
}

router.post('/authenticate', services.authenticateUser)
router.post('/resetpassword', services.resetPassword)

module.exports = router