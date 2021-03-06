var q = require('q')

userModel = {
  /* Get session details */
  getUserSessionInfo: function (connection, user_id) {
    var deferred = q.defer()
    var sql = 'SELECT u.mail_id,ud.phone_number,u.user_id,u.status,ud.first_name,ud.last_name,ud.location,ur.role_id, ' +
      'urt.role_type_name FROM healthcare.`user` u JOIN healthcare.user_details ud' +
      ' ON u.user_id=ud.user_id JOIN healthcare.user_role ur ON u.user_id=ur.user_id ' +
      'JOIN healthcare.user_role_type urt ON ur.role_id=urt.role_id where u.user_id = ?  LIMIT 0,1 '

    connection.queryRow(sql, [user_id], function (err, user) {

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
    var sql = 'SELECT u.mail_id,ud.phone_number,u.user_id,ud.first_name,ud.last_name,ud.location,ur.role_id, ' +
      'urt.role_type_name FROM healthcare.`user` u JOIN healthcare.user_details ud' +
      ' ON u.user_id=ud.user_id JOIN healthcare.user_role ur ON u.user_id=ur.user_id ' +
      'JOIN healthcare.user_role_type urt ON ur.role_id=urt.role_id where u.mail_id = ? AND u.password=? ' +
      ' AND u.status=1 LIMIT 0,1 '

    connection.queryRow(sql, [data.username, data.password], function (err, user) {
      if (err) {
        console.log('DB Error at authenticate: ', err.message)
        deferred.reject('Server Error Occured' + err.message)
      }
      else {
        console.log(JSON.stringify(user) + '  ')
        deferred.resolve(user)
      }
    })
    return deferred.promise
  },

  getAppointmentStatus: function (connection, user_id) {
    var deferred = q.defer()
    console.log('appointment')
    var sql = 'SELECT' +
      ' app.doctor_id,' +
      ' app.patient_id,' +
      ' app.status,' +
      ' u.mail_id,' +
      ' CONCAT( ud.first_name, \' \', ud.last_name ) AS name,' +
      ' ud.location,' +
      ' ud.phone_number,' +
      ' app.date_time ' +
      ' FROM' +
      ' user_details ud' +
      ' JOIN healthcare.`user` u ON' +
      ' u.user_id = ud.user_id' +
      ' JOIN healthcare.appointment app ON' +
      ' ud.user_id = app.patient_id' +
      ' WHERE' +
      ' app.status = 1' +
      ' AND app.doctor_id = ? AND TIMESTAMPDIFF(MINUTE,  now(),app.date_time)>=0'
    connection.query(sql, [user_id], function (err, res) {
      if (err) {
        console.log(err)
        deferred.reject(err)
      } else {
        deferred.resolve(res)
      }
    })
    return deferred.promise
  },

  updateAppointment: function (connection, data) {
    var deferred = q.defer()
    var sql = 'UPDATE healthcare.appointment SET status=0 WHERE doctor_id=? AND patient_id=? AND date_time=?'
    connection.query(sql, [data.doctor_id, data.patient_id, data.date_time], function (err, result) {
      if (err) {
        deferred.reject(err)
      } else {
        deferred.resolve(data)
      }
    })
    return deferred.promise
  },
  updateDoctorHistory: function (connection, data, status, curr_date) {
    var deferred = q.defer()
    console.log(data, status, curr_date)
    var sql = 'INSERT INTO healthcare.doctor_history (doctor_id,patient_id,checked_date_time,status,req_appointment_time) VALUES (?,?,?,?,?)'

    connection.query(sql, [data.doctor_id, data.patient_id, data.date_time, status, curr_date], function (err, result) {
      if (err) {
        deferred.reject(err)
      } else {
        deferred.resolve(result)
      }
    })
    return deferred.promise
  },

  getDoctorHistory: function (connection, user_id) {
    var deferred = q.defer()
    var sql = ' SELECT CONCAT(dn.first_name,\' \',dn.last_name) AS doctor_name,  CONCAT(ud.first_name,\' \',ud.last_name) ' +
      ' AS patient_name,u.mail_id,ud.location,ud.phone_number,dh.doctor_id,dh.patient_id,dh.checked_date_time, ' +
      ' dh.req_appointment_time,dh.status FROM healthcare.doctor_history dh JOIN healthcare.user_details ud ON ' +
      ' dh.patient_id=ud.user_id JOIN healthcare.`user` u ON ud.user_id=u.user_id JOIN ' +
      ' healthcare.user_details dn ON dh.doctor_id=dn .user_id WHERE  dh.doctor_id=?'
    connection.query(sql, [user_id], function (err, result) {
      if (err) {
        deferred.reject(err)
      } else {
        deferred.resolve(result)
      }
    })
    return deferred.promise
  },
  getPatientHistory: function (connection, user_id) {
    var deferred = q.defer()
    var sql='SELECT CONCAT(dn.first_name,\' \',dn.last_name) AS patient_name,  CONCAT(ud.first_name,\' \',ud.last_name) '+
   ' AS doctor_name,ud.location,ud.phone_number,u.mail_id,dh.doctor_id,dh.patient_id,dh.checked_date_time,dh.req_appointment_time,dh.status FROM '+
   ' healthcare.doctor_history dh JOIN healthcare.user_details ud ON dh.doctor_id=ud.user_id JOIN healthcare.`user` '+
   ' u ON ud.user_id=u.user_id JOIN healthcare.user_details dn ON dh.patient_id=dn .user_id WHERE dh.patient_id=?';
    connection.query(sql, [user_id], function (err, result) {
      if (err) {
        deferred.reject(err)
      } else {
        deferred.resolve(result)
      }
    })
    return deferred.promise
  },

  bookAppointment: function (connection, data) {
    var deferred = q.defer()
    console.log('user details', data)
    var sql = 'INSERT INTO healthcare.appointment (doctor_id,patient_id,date_time) VALUES(?,?,STR_TO_DATE(?,\'%Y-%m-%d %H:%i:%s\'));'

    console.log(sql)
    connection.query(sql, [data.user_id, data.patient_id, data.date + ' ' + data.time], function (err, result) {

      if (err) {
        console.log(err)
        deferred.reject(err)
      } else {
        deferred.resolve(result)
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
  getSpecialityId: function (connection,speciality) {
    var deferred = q.defer()
    var sql = 'select speciality_id from healthcare.`speciality_name` where speciality=?'

    connection.queryRow(sql, [speciality], function (err, result) {
      if (err) {
        console.log('err in rrrr',err)
        deferred.reject(err)
      }
      else {
        deferred.resolve(result)
      }
    })
    return deferred.promise
  },
  addDoctorSpeciality: function (connection,data,speciality_id) {
    console.log('called')
    var deferred = q.defer()
    var sql = 'INSERT INTO healthcare.doctor_speciality (doctor_id,speciality_id) VALUES (?,?);'

    connection.query(sql, [data.user_id,speciality_id], function (err, result) {
      if (err) {
        deferred.reject(err)
      }
      else {
        deferred.resolve(result)
      }
    })
    return deferred.promise
  } ,
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
  getUserDetailsByRole: function (connection, role) {
    var deferred = q.defer()
    /*var sql=" " +
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
      "  ); ";*/

    var sql = 'SELECT u.user_id,u.mail_id, CONCAT( ud.first_name, ud.last_name ) AS name, ' +
      ' ud.location, ud.phone_number, sn.speciality FROM  healthcare.`user` u JOIN healthcare.user_details ud ' +
      ' ON u.user_id = ud.user_id JOIN healthcare.user_role ur ON ud.user_id = ur.user_id LEFT JOIN ' +
      ' healthcare.user_role_type urt ON ur.role_id = urt.role_type_id LEFT JOIN healthcare.doctor_speciality s ' +
      ' ON s.doctor_id = ur.user_id LEFT JOIN speciality_name sn ON s.speciality_id = sn.speciality_id ' +
      ' WHERE ur.role_id =( SELECT role_id FROM user_role_type WHERE role_type_name =\'doctor\' ) AND u.status=1'
    console.log(sql)
    connection.query(sql, ['doctor'], function (err, result) {
      if (err) {
        console.log(err)
        deferred.reject(err)
      }
      else {
        deferred.resolve(result)
      }
    })
    return deferred.promise
  },

  verifyUser: function (connection, data) {
    var deferred = q.defer()
    console.log('hai from verifyUser')
    console.log(JSON.stringify(data))
    var sql = 'SELECT u.user_id,u.mail_id,CONCAT(ud.first_name," ",ud.last_name) AS name FROM 	healthcare.`user` u ' +
      'JOIN healthcare.user_details ud ON u.user_id=ud.user_id WHERE u.status=? AND u.mail_id=?'
    connection.query(sql, [1, data.username], function (err, result) {
      if (err) {
        deferred.reject(err)
      } else {
        deferred.resolve(result)
      }
    })
    return deferred.promise
  },
  getAllUser: function (connection) {
    var deferred = q.defer()

    var sql = 'SELECT u.mail_id,CONCAT( ud.first_name, ud.last_name ) '+
      ' AS name,ud.location, ud.phone_number FROM healthcare.`user` u '+
      ' JOIN healthcare.user_details ud ON u.user_id = ud.user_id where u.status =1'

    connection.query(sql, [], function (err, result) {
      if (err) {
        deferred.reject(err)
      } else {
        deferred.resolve(result)
      }
    })
    return deferred.promise
  },

  trackResetPassword: function (connection, data) {
    var deferred = q.defer()
    console.log('hai from resetLInk')
    console.log(JSON.stringify(data))
    var sql = 'insert into password_reset (user_id,reset_token,status,expiry_time) values(?,?,?,?);'
    connection.query(sql, [data.user_id, data.token, 1, data.expiry_time], function (err, result) {
      if (err) {
        console.log('error' + err)
        deferred.reject(err)
      } else {
        deferred.resolve(result)
      }
    })
    return deferred.promise
  },

  verifyTokenAndTime: function (connection, data) {
    var deferred = q.defer()
    var sql = 'SELECT user_id FROM healthcare.password_reset WHERE status=1 AND  ' +
      'TIMESTAMPDIFF(MINUTE, expiry_time, now())<=5 AND ' +
      'reset_token=?'
    connection.queryRow(sql, [data.token], function (err, result) {
      if (err) {
        deferred.reject(err)
      } else {
        deferred.resolve(result)
      }
    })
    return deferred.promise
  },

  updatePassword: function (connection, data) {
    var deferred = q.defer()
    var sql = 'UPDATE healthcare.user SET password=? where user_id=?'
    connection.query(sql, [data.password, data.user_id], function (err, result) {
      if (err) {
        deferred.reject(err)
      } else {
        deferred.resolve(result)
      }
    })
    return deferred.promise
  },
  filterUserDetails: function (connection, filterOption) {
    var deferred = q.defer()
    var sql =
      'SELECT ' +
      'u.user_id,' +
      'u.mail_id, ' +
      'CONCAT( ud.first_name, ud.last_name ) name, ' +
      'ud.location, ' +
      'ud.phone_number, ' +
      'urt.role_type_name, ' +
      'sn.speciality ' +
      'FROM ' +
      ' healthcare.`user` u' +
      ' JOIN healthcare.user_details ud ON' +
      ' u.user_id = ud.user_id' +
      ' JOIN healthcare.user_role ur ON' +
      ' ud.user_id = ur.user_id' +
      ' LEFT JOIN healthcare.user_role_type urt ON' +
      ' ur.role_id = urt.role_type_id' +
      ' LEFT JOIN healthcare.doctor_speciality s ON' +
      ' s.doctor_id = ur.user_id' +
      ' LEFT JOIN speciality_name sn ON' +
      ' s.speciality_id = sn.speciality_id' +
      ' WHERE' +
      ' ur.role_id =(' +
      ' SELECT' +
      ' role_type_id' +
      ' FROM' +
      ' user_role_type' +
      ' WHERE' +
      ' role_type_name =? ' +
      ' ) AND sn.speciality=?'
    connection.query(sql, ['doctor', filterOption], function (err, result) {
      if (err) {
        deferred.reject(err)
      } else {
        deferred.resolve(result)
      }
    })
    return deferred.promise
  },
  updateUserDetails: function (connection, data) {
    var deferred = q.defer()
    sql = 'UPDATE healthcare.user_details ud SET ud.first_name=? , ud.last_name=? ,ud.phone_number=? , ud.location=?  WHERE ud.user_id = ?'

    connection.query(sql, [data.firstName, data.lastName, data.phone, data.location, data.userId], function (err, result) {
      if (err) {
        deferred.reject(err)
      } else {
        deferred.resolve(result)
      }

    })
    return deferred.promise
  },

  deleteUserDetails: function (connection, user_id) {
    var deferred = q.defer()
    var sql = 'update user set status=0 where mail_id=?'
    connection.query(sql, [user_id], function (err, result) {
      if (err) {
        deferred.reject(err)
      } else {
        deferred.resolve(result)
      }
    })
    return deferred.promise
  } ,
  getUserRole: function (connection,user_id) {
    var deferred=q.defer();
    var sql='SELECT role_type_name AS role_name FROM healthcare.user_role_type WHERE role_id='+
      '(SELECT role_id FROM healthcare.user_role WHERE user_id=?)';
    connection.queryRow(sql,[user_id],function (err,result) {
      if(err){
        deferred.reject(err)
      }else{
        deferred.resolve(result)
      }
    })
    return deferred.promise;
  }

}

module.exports = userModel