var q = require('q');

userModel = {
    /* Get session details */
    getUserSessionInfo: function (connection, user_id) {
        var deferred = q.defer();
        var userObject;
        console.log("INSIDE USER INFO");
        var sql = "SELECT u.user_id,u.status,ud.first_name,ud.last_name,ud.location,ur.role_id, " +
            "urt.role_type_name FROM healthcare.`user` u JOIN healthcare.user_details ud" +
            " ON u.user_id=ud.user_id JOIN healthcare.user_role ur ON u.user_id=ur.user_id " +
            "JOIN healthcare.user_role_type urt ON ur.role_id=urt.role_id where u.user_id = ?  LIMIT 0,1 ";
        connection.queryRow(sql, [user_id], function (err, user) {
            if (err) {
                console.log("error at user info")
                console.log("DB Error at getUserSessionInfo: ", err);
                deferred.reject("Server Error Occured");
            }
            else {
                console.log("no error at user info")
                userObject = user;
                deferred.resolve(userObject);
            }
        });
        return deferred.promise;
    }

}

module.exports=userModel;