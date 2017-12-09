var baseDir = process.cwd();
//var dbConnection = require(baseDir + '/services/mysql/index.js')

var apiResponseConstant = require("../utilities/constants/apiResponseConstants");
var utility = require(baseDir + "/utilities/utilityMethods");
var userModel = require(baseDir + '/models/users/user');
var sessionModel = require(baseDir + '/models/session/session');
var baseDir = process.cwd();
var mysql = require('mysql');
var config = require(baseDir + '/config/config.js');

var dbConnection = mysql.createConnection({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
});


var middlewares = {
    'middlewareList': [
        {
            description: 'Sets the headers to allow cross-domain requests.',
            run: function (req, res, next) {
                //console.log('Crosss origin request: ',(req.method || '').toUpperCase());
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
                res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Requested-With,x-user-token,x-candidate-token');

                if ('OPTIONS' === (req.method || '').toUpperCase()) {
                    return res.status(200).end();
                }
                console.log("CROSS ORIGIN OK");
                next();
            }
        },
        {
            description: 'Validate the session token',
            run: function (req, res, next) {

                {
                    // Add Url to skip from Auth token validation
                    if (req.url === 'authenticate'
                        || req.url === '/reset-password' || req.url === 'change-password') {
                        next();
                    } else {
                        var session_token = req.headers['x-user-token'];
                        console.log("session token is : " + session_token);
                       /* if (!session_token) {
                            return res.send("INVALID_TOKEN").end("");
                        } else {
                       */     var sessionObject;

                            dbConnection.connect(function (err) {
                                if (err) {
                                    return res.send("UNKNOWN_ERROR_OCCURRED").end();
                                } else {
                                    console.log("DB CONNECTED");
                                    return sessionModel.checkSession(dbConnection, session_token)
                                        .then(function (session) {
                                            console.log("SESSION OBJ : "+session)
                                            if (!session || session == null) {
                                                console.log("ERROR IN SESSION ")
                                                res.send("INVALID_TOKEN").end("");
                                            }
                                            console.log("DOWN")
                                        sessionObject = session;
                                            return userModel.getUserSessionInfo(dbConnection, 1);
                                        }).then(function (user) {
                                            req.session = user;
                                            console.log("req.session: ", req.session);
                                            return sessionModel.updateSessionExpiryTime(dbConnection, sessionObject.user_session_id, utility.add_minute_current_datetime(30));
                                        }).then(function (session) {
                                            connection.commit();
                                            connection.release();
                                            console.log("Token: ", session_token);
                                            next();
                                        }).catch(function (error) {
                                            connection.rollback();
                                            connection.release();
                                            console.log("EEEEEEEEEEEEEEEE")
                                            return res.$end(error);
                                        })
                                }

                            });
                     //   }

                    }
                }

            }
        },
    ]
}

module.exports = middlewares;
