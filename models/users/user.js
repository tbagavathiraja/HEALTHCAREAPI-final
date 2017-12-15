var q = require('q')

userModel = {
  /* Get session details */
  getUserSessionInfo: function (connection, user_id) {
    var deferred = q.defer()
    var sql = 'SELECT u.user_id,u.status,ud.first_name,ud.last_name,ud.location,ur.role_id, ' +
      'urt.role_type_name FROM healthcare.`user` u JOIN healthcare.user_details ud' +
      ' ON u.user_id=ud.user_id JOIN healthcare.user_role ur ON u.user_id=ur.user_id ' +
      'JOIN healthcare.user_role_type urt ON ur.role_id=urt.role_id where u.user_id = ?  LIMIT 0,1 '

    connection.query(sql, [user_id], function (err, user) {

      if (err) {
        console.log('error at user info')
        console.log('DB Error at getUserSessionInfo: ', err)
        deferred.reject('Server Error Occured')
      }
      else {
        deferred.resolve(user)
      }
    })
    return deferred.promise
  },

  /* Authenticate user for login */
  authenticate: function (connection, data) {
    var deferred = q.defer()
    console.log('here' + JSON.stringify(data))
    var sql = 'SELECT u.user_id,ud.first_name,ud.last_name,ud.location,ur.role_id, ' +
      'urt.role_type_name FROM healthcare.`user` u JOIN healthcare.user_details ud' +
      ' ON u.user_id=ud.user_id JOIN healthcare.user_role ur ON u.user_id=ur.user_id ' +
      'JOIN healthcare.user_role_type urt ON ur.role_id=urt.role_id where u.mail_id = ? AND u.password=? ' +
      ' AND u.status=1 LIMIT 0,1 '

    connection.query(sql, [data.username, data.password], function (err, user) {
      if (err) {
        console.log('DB Error at authenticate: ', err.message)
        deferred.reject('Server Error Occured' + err.message)
      }
      else {
         console.log(JSON.stringify(user)+"  ");
        deferred.resolve(user)
      }
    })
    return deferred.promise
  },

  /* add new user */

  addUser: function (connection, data) {
    var deferred = q.defer()
    console.log('new User before add : ' + JSON.stringify(data))
    var sql = 'INSERT INTO healthcare.`user` (mail_id,password,status,created_date) VALUES(?,?,?,?);'
    connection.query(sql, [data.email, data.password, 1, data.createdDate], function (err, result) {
      if (err) {
        deferred.reject(err)
      }
      else {
        deferred.resolve(result)
      }
    })
    return deferred.promise
  },
  addUserDetails: function (connection, data) {
    var deferred = q.defer()
    var sql = 'INSERT INTO healthcare.user_details (user_id,first_name,last_name,' +
      'location,phone_number,created_date) VALUES(?,?,?,?,?,?)'
    connection.query(sql, [data.user_id, data.firstName, data.lastName, data.location, data.phone, data.createdDate], function (err, result) {

      if (err) {
        deferred.reject(err)
      }
      else {
        deferred.resolve(result)
      }
    })
    return deferred.promise
  },
  adduserRole: function (connection, data) {
    var deferred = q.defer()
    var sql = 'INSERT INTO healthcare.user_role (role_id,user_id) VALUES (?,?)'

    connection.query(sql, [data.role_id, data.user_id], function (err, result) {
      if (err) {
        deferred.reject(err)
      }
      else {
        deferred.resolve(result)
      }
    })
    return deferred.promise
  },
  getUserDetailsByRole(connection,role){
    var deferred=q.defer();
    var sql=" " +
      "SELECT " +
      "  u.user_id, " +
      "  u.mail_id,CONCAT " +
      "  ( " +
      "    ud.first_name, " +
      "    ud.last_name " +
      "  ) AS name, ud.location, " +
      "  ud.phone_number " +
      "FROM " +
      "  healthcare.`user` u " +
      "JOIN healthcare.user_details ud ON " +
      "  u.user_id = ud.user_id " +
      "JOIN healthcare.user_role ur ON " +
      "  u.user_id = ur.user_id " +
      "WHERE " +
      "  ur.role_id =( " +
      "    SELECT " +
      "      role_id " +
      "    FROM " +
      "      healthcare.user_role_type " +
      "    WHERE " +
      "      role_type_name = ? " +
      "  ); ";
    connection.query(sql,[role],function (err,result) {
      if(err){
        deferred.reject(err)
      }
      else{
        deferred.resolve(result);
      }
    })
    return deferred.promise;
  } ,

  verifyUser(connection,data) {
    var deferred = q.defer();
    console.log("hai from verifyUser")
console.log(JSON.stringify(data))
    var sql = 'SELECT u.user_id,u.mail_id,CONCAT(ud.first_name," ",ud.last_name) AS name FROM 	healthcare.`user` u ' +
      'JOIN healthcare.user_details ud ON u.user_id=ud.user_id WHERE u.status=? AND u.mail_id=?';
    connection.query(sql, [1,data.username], function (err, result) {
      if (err) {

        deferred.reject(err);
      } else {
        deferred.resolve(result);
      }
    })
    return deferred.promise;
  } ,
  
  trackResetPassword: function (connection,data) {
    var deferred = q.defer();
    console.log("hai from resetLInk")
    console.log(JSON.stringify(data))
    var sql = 'insert into password_reset (user_id,reset_token,status,expiry_time) values(?,?,?,?);';
    connection.query(sql, [data.user_id,data.token,1,data.expiry_time], function (err, result) {
      if (err) {
        console.log('error' +err)
        deferred.reject(err);
      } else {
        deferred.resolve(result);
      }
    })
    return deferred.promise;
  },

  verifyTokenAndTime: function (connection,data){
  var deferred=q.defer();
  var sql='SELECT user_id FROM healthcare.password_reset WHERE status=1 AND  ' +
    'TIMESTAMPDIFF(MINUTE, expiry_time, now())<=5 AND ' +
    'reset_token=?'
    connection.queryRow(sql,[data.token],function (err,result) {
      if(err){
        deferred.reject(err);
      }else{
        deferred.resolve(result);
      }
    });
  return deferred.promise;
} ,

  updatePassword: function(connection,data){
    var deferred=q.defer();
    var sql='UPDATE healthcare.user SET password=? where user_id=?';
    connection.query(sql,[data.password,data.user_id],function (err,result) {
      if(err){
        deferred.reject(err);
      }else{
        deferred.resolve(result);
      }
    });
    return deferred.promise;
  }



}

module.exports = userModel