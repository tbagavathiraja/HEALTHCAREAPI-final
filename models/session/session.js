var q = require('q');

var sessionModel = {
    addSession: function (connection, session) {
        var deferred = q.defer();
        var sql = 'INSERT INTO `user_session`  (`user_id`, `session_auth_token`, `expiry_time`) VALUES ' +
            ' (?, ?, ?) ';
        connection.query(sql, [session.user_id, session.session_auth_token,session.expiry_time], function (err, user) {
            if (err) {
                console.log("DB Error at addSession: ", err.message);
                deferred.reject("Server Error Occured");
            }
            else {
                deferred.resolve(session);
            }
        });
        return deferred.promise;
    },

    checkSession: function (connection, token) {
        var deferred = q.defer();
        var sql = 'select user_session_id,user_id,expiry_time from user_session where  session_auth_token = ? and expiry_time > now() LIMIT 0,1';
        connection.queryRow(sql,[token],function (err, result) {
            if (err) {
                console.log("here" + err.message)
                deferred.reject('Server Error Occured');
            }
            else {
                deferred.resolve(result);
            }
        });
        return deferred.promise;
    },
    updateSessionExpiryTime: function (connection, session_id, expiry_time) {
        var deferred = q.defer();
        var updateSql = "UPDATE user_session set expiry_time = ?  where user_session_id = ? ";
        connection.query(updateSql, [expiry_time, session_id], function (err, session) {
            if (err) {
                console.log("DB Error at updateSessionExpiryTime: ", err.message);
                deferred.reject("Server Error Occured");
            } else {
                deferred.resolve(session);
            }
        });
        return deferred.promise;
    },
    deleteSession: function (connection, token) {
        var deferred = q.defer();
        var sql = "update user_session SET expiry_time = NOW() where session_auth_token = ? ";
        connection.query(sql, [token], function (err, session) {
            if (err) {
                deferred.reject(err);
            }
            else {
                deferred.resolve('success');
            }
        });
        return deferred.promise;
    },
}

module.exports = sessionModel;