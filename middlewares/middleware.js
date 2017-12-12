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
      description: 'Sets the headers to allow cross-domain requests.',
      run: function (req, res, next) {
        console.log(req.url)
        //console.log('Crosss origin request: ',(req.method || '').toUpperCase());
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
      description: 'Validate the session token',
      run: function (req, res, next) {
        // Add Url to skip from Auth token validation
        if (req.url === '/authenticate'
          || req.url === '/reset-password' || req.url === 'change-password') {
          next()
        } else {
          var session_token = req.headers['x-user-token']
          console.log('session token is : ' + session_token)
          if (!session_token) {
            return res.send('INVALID_TOKEN').end('')
          } else {
            var sessionObject

            dbConnection.getConnection(true,function (err,connection) {
              if (err) {
                return res.send('UNKNOWN_ERROR_OCCURRED'+err.message).end()
              } else {
                return sessionModel.checkSession(connection, session_token)
                  .then(function (session) {
                  //console.log('SESSION OBJ : ' +JSON.stringify(session[0]))
                    if (!session || session == null) {
                      console.log('ERROR IN SESSION ')
                      res.send('INVALID_TOKEN').end('')
                    }
                    sessionObject = session[0];
                    return userModel.getUserSessionInfo(connection, sessionObject.user_id)
                  }).then(function (user) {
                    req.session = user[0]
                    console.log('req.session: ', req.session);
                    return sessionModel.updateSessionExpiryTime(connection, sessionObject.user_session_id, utility.add_minute_current_datetime(30))
                  }).then(function (session) {
                    console.log("Session updated successfully "+sessionObject.user_session_id+"  "+utility.add_minute_current_datetime(30))
                    connection.commit();
                    connection.release();
                   // console.log(utility.add_minute_current_datetime(30)+'Token: ', session_token+"  "+JSON.stringify(session))
                    next()
                  }).catch(function (error) {
                    connection.rollback()
                    connection.release()
                    console.log('EEEEEEEEEEEEEEEE'+error.message)
                    return res.$end(error)
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
