var baseDir = process.cwd();

var express = require('express');
var router = express.Router();
var dbConnection = require(baseDir + '/services/mysql');
const q = require('q');

var login = {

    authenticateUser: function (req, res) {

        var data = req.body;

        return authenticate(data)
            .then(function (result) {
                return res.$end(result);
            }).catch(function (err) {
                res.$end(error);
            });
    }
};

function authenticate(data) {
    var deferred = q.defer();

    var userObject;
    var addSessionDetails;
console.log("AUUTHHHHH")
    dbConnection.connect(function (err, connection) {
        if (err) {
            deferred.reject("UNKNOWN_ERROR_OCCURRED");
        } else {
            data.password = utility.hashPassword(data.password);
            return userModel.authenticate(connection, data)
                .then(function (user) {
                    userObject = user;
                    // Check if data present
                    if (!user || user === null) {
                        deferred.reject("INVALID_CREDENTIALS");
                    }
                    else {
                        user_type = user.role_type_name;
                        var token = utility.hashPassword(user.user_id + utility.current_datetime());
                        addSessionDetails = {
                            session_auth_token: token,
                            expiry_time: utility.add_minute_current_datetime(5),
                            user_id: user.user_id
                        };
                    }
                    return sessionModel.addSession(connection, addSessionDetails)
                })
                .then(function (session) {
                    let userInfo;
                    userInfo.push(userObject, addSessionDetails);
                    return deferred.resolve(userInfo);
                })
                .catch(function (error) {
                    connection.release();
                    return deferred.reject(error);
                });
        }

    });
    return deferred.promise;
}

router.post('/loign', login.authenticateUser)

module.exports=router;