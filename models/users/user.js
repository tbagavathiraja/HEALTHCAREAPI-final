var q = require('q');

userModel = {
    /* Get session details */
    getUserSessionInfo: function (connection, user_id) {
        var deferred = q.defer();
        var sql = "SELECT u.user_id,u.status,ud.first_name,ud.last_name,ud.location,ur.role_id, " +
            "urt.role_type_name FROM healthcare.`user` u JOIN healthcare.user_details ud" +
            " ON u.user_id=ud.user_id JOIN healthcare.user_role ur ON u.user_id=ur.user_id " +
            "JOIN healthcare.user_role_type urt ON ur.role_id=urt.role_id where u.user_id = ?  LIMIT 0,1 ";

        connection.query(sql, [user_id], function (err, user) {

            if (err) {
                console.log("error at user info")
                console.log("DB Error at getUserSessionInfo: ", err);
                deferred.reject("Server Error Occured");
            }
            else {
                deferred.resolve(user);
            }
        });
        return deferred.promise;
    },

    /* Authenticate user for login */
    authenticate: function (connection, data) {
        var deferred = q.defer();
        console.log("here"+JSON.stringify(data))
        var sql = "SELECT u.user_id,ud.first_name,ud.last_name,ud.location,ur.role_id, " +
            "urt.role_type_name FROM healthcare.`user` u JOIN healthcare.user_details ud" +
            " ON u.user_id=ud.user_id JOIN healthcare.user_role ur ON u.user_id=ur.user_id " +
            "JOIN healthcare.user_role_type urt ON ur.role_id=urt.role_id where u.mail_id = ? AND u.password=? "+
            " AND u.status=1 LIMIT 0,1 ";

        connection.query(sql, [data.username, data.password], function (err, user) {
            if (err) {
                console.log("DB Error at authenticate: ", err.message);
                deferred.reject("Server Error Occured");
            }
            else {
               // console.log("IIIIIIII"+JSON.stringify(user)+"  ");
                deferred.resolve(user);
            }
        });
        return deferred.promise;
    }

}

module.exports = userModel;