var baseDir = process.cwd()
dbConnection = require(baseDir + '/services/mysql')

var apiResponseConstant = require('../utilities/constants/apiResponseConstants')
var utility = require(baseDir + '/utilities/utilityMethods')
var userModel = require(baseDir + '/models/users/user')
var sessionModel = require(baseDir + '/models/session/session')
var baseDir = process.cwd()
var mysql = require('mysql')
var config = require(baseDir + '/config/config.js')

var middlewares = {
  'middlewareList': [
    {
      run: function (req, res, next) {
        console.log(req.url)
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Requested-With,x-user-token,x-candidate-token')

        if ('OPTIONS' === (req.method || '').toUpperCase()) {
          return res.status(200).end()
        }
        next()
      }
    },
    {
      run: function (req, res, next) {
        // Add Url to skip from Auth token validation
        if (req.url === '/authenticate'
          || req.url === '/resetpassword' || req.url === '/change-password'|| req.url==='/updatepassword') {
          next()
        } else {
          var session_token = req.headers['x-user-token']
          console.log('session token is : ' + session_token);
          if (!session_token) {
            console.log('token erroe')
            return res.send('INVALID_TOKEN').end('')
          } else {
            var sessionObject
            dbConnection.getConnection(true,function (err,connection) {
              if (err) {
                console.log(err)
                return res.send('UNKNOWN_ERROR_OCCURRED'+err.message).end()
              } else {
                console.log('calling....')
                 sessionModel.checkSession(connection, session_token)
                  .then(function (session) {
                 console.log('SESSION OBJ : ' +JSON.stringify(session))
                    if (!session) {
                      console.log('ERROR IN SESSION ')
                      let err={
                        status: 'INVALID_TOKEN'
                      }
                      throw (err)
                    }
                      sessionObject = session;
                       userModel.getUserSessionInfo(connection, sessionObject.user_id)
                    }).then(function (user) {
                    req.session = user;
                    console.log('req.session: ',req.session );
                     sessionModel.updateSessionExpiryTime(connection, sessionObject.user_session_id, utility.add_minute_current_datetime(30))
                  }).then(function (session) {
                    console.log("Session updated successfully "+sessionObject.user_session_id+"  "+utility.add_minute_current_datetime(30))
                    connection.commit();
                    connection.release();
                   // console.log(utility.add_minute_current_datetime(30)+'Token: ', session_token+"  "+JSON.stringify(session))
                    next()
                  }).catch(function (error) {
                    connection.rollback()
                    connection.release()
                    console.log("ERR "+JSON.stringify(error))
                    return res.end(JSON.stringify(error))
                  })
              }

            })
               }

          }

        }
      },
  ]
}

module.exports = middlewares
