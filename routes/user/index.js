var baseDir = '/home/ionixx/WebstormProjects/HEALTHCAREAPI-final';
var router = require('../common')
var userModel = require(baseDir + '/models/users/user')
var dbConnection = require(baseDir + '/services/mysql')
const q = require('q')
var utility = require(baseDir + '/utilities/utilityMethods')
var responseConstants = require(baseDir + '/utilities/constants/apiResponseConstants.js')
var user = {

  addUser: function (req, res) {
    console.log('inserting new user')
    var data = req.body
    res.setHeader('content-type', 'application/json')
    return createUser(data)
      .then(function (result) {
        console.log('RES : ' + JSON.stringify(result))
        return res.send(result).end('')
      }).catch(function (err) {
        console.log('RES ERROR : ' + err.code)

        if (err.code === 'ER_DUP_ENTRY') {
          err.status = responseConstants.EMAIL_ALREADY_EXIST
        }
        return res.send(JSON.stringify(err)).end('')
      })
  },

  getUsers: function (req, res) {
    console.log('getting information....')
    res.setHeader('content-type', 'application/json')
    var role = req.params['role']
    return getUserDetails(role)
      .then(function (result) {
        res.status = responseConstants.SUCCESS
        console.log('RES : ' + JSON.stringify(result))
        return res.send(result).end('')
      }).catch(function (err) {
        return res.send(JSON.stringify(err)).end('')
      })

  },

  resetPassword: function (req, res) {
    console.log('updating password....')
    res.setHeader('content-type', 'application/json')
    var data = req.body
    return updatePassword(data)
      .then(function (result) {
        res.status = responseConstants.success
        result.status = responseConstants.SUCCESS

        console.log('RES : ' + JSON.stringify(result))
        return res.send(result).end('')
      }).catch(function (err) {
        err['status'] = responseConstants.FAILURE
        return res.send(JSON.stringify(err)).end('')
      })
  },

  filterBy: function (req, res) {
    var filterOption = 'general'
    console.log('filtering user by ' + filterOption)
    res.setHeader('content-type', 'application/json')
    return filterUsers(filterOption)
      .then(function (result) {
        res.status = responseConstants.success
        console.log('RES : ' + JSON.stringify(result))
        return res.send(result).end('')
      }).catch(function (err) {
        return res.send(JSON.stringify(err)).end('')
      })
  },
  updateProfile: function (req, res) {
    console.log('updateing user...')
    var data = req.body
    res.setHeader('content-type', 'application/json')
    return updateUser(data)
      .then(function (result) {
        console.log('RES : ' + JSON.stringify(result))
        result.status = 'success'
        return res.send(result).end('')
      }).catch(function (err) {
        return res.send(JSON.stringify(err)).end('')
      })

  },
  bookAppointment: function (req, res) {
    console.log('booking ...')
    var data = req.body
    res.setHeader('content-type', 'application/json')
    return getAppointment(data)
      .then(function (result) {
        console.log('RES : ' + JSON.stringify(result))
        result.status = 'success'
        return res.send(result).end('')
      }).catch(function (err) {
        return res.send(JSON.stringify(err)).end('')
      })

  },
  updateAppointmentStatus: function (req, res) {
    var status = req.params['status']
    console.log('updating status ...')
    var data = req.body
    res.setHeader('content-type', 'application/json')
    return updateUserAppointment(data, status)
      .then(function (result) {
        result.status = 'success'
        return res.send(result).end('')
      }).catch(function (err) {
        return res.send(JSON.stringify(err)).end('')
      })

  },
  deleteUser: function (req, res) {
    console.log('deleting user')
    const mailId = req.params['mailId']
    res.setHeader('content-type', 'application/json')
    var user_id = req.params['user_id']
    return removeUser(mailId)
      .then(function (result) {
        res.status = responseConstants.SUCCESS
        console.log('RES : ' + JSON.stringify(result))
        return res.send(result).end('')
      }).catch(function (err) {
        return res.send(JSON.stringify(err)).end('')
      })

  },
  history: function (req, res) {
    var user_id = req.params['userId']
    console.log('getting history of ', user_id)

    res.setHeader('content-type', 'application/json')
    return getUserHistory(user_id)
      .then(function (result) {
        res.status = responseConstants.SUCCESS
        console.log('RES : ' + JSON.stringify(result))
        return res.send(result).end('')
      }).catch(function (err) {
        console.log('response : ', err)
        return res.send(JSON.stringify(err)).end('')
      })
  }

}





function getUserHistory (user_id) {

  var deferred = q.defer()
  dbConnection.getConnection(false, function (err, connection) {
    if (err) {
      throw ('DB ERROR OCCURED')
    } else {
      return userModel.getUserRole(connection,user_id)
        .then((role)=>{
          console.log('result is : ',role)
          if(!role){
            throw ('UNAUTHORIZED USER')
          }
          if(role['role_name']==='doctor') {
            return userModel.getDoctorHistory(connection, user_id)
          }else{
            return userModel.getPatientHistory(connection,user_id)
          }
        }).then(function (history) {
          // for changing timezone to local
          console.log('pending')
          history.forEach(function (user) {
            user.checked_date_time = utility.format_date(user.checked_date_time)
            user.req_appointment_time = utility.format_date(user.req_appointment_time)
          })

          deferred.resolve(history)
        })
        .catch(function (err) {
          deferred.reject(err)
        })
    }
  })
  return deferred.promise
}

function updateUserAppointment (data, status) {
  var deferred = q.defer()

  dbConnection.getConnection(false, function (err, connection) {
    if (err) {
      throw ('DB ERROR OCCURED')
    } else {
      return userModel.updateAppointment(connection, data)
        .then(function (result) {
          return userModel.updateDoctorHistory(connection, data, status, utility.current_datetime())
        })
        .then(function (result) {
          deferred.resolve(result)
        })
        .catch(function (err) {
          deferred.reject(err)
        })
    }
  })
  return deferred.promise
}

function removeUser (mail_id) {
  var deferred = q.defer()

  dbConnection.getConnection(false, function (err, connection) {
    if (err) {
      throw ('DB ERROR OCCURED')
    } else {
      return userModel.deleteUserDetails(connection, mail_id)
        .then(function (result) {
          result.status = responseConstants.SUCCESS
          deferred.resolve(result)
        }).catch(function (err) {
          deferred.reject(err)
        })
    }
  })
  return deferred.promise

}

function getAppointment (data) {
  var deferred = q.defer()
  dbConnection.getConnection(false, function (err, connection) {
    if (err) {
      throw ('DB Error occured')
    } else {

      return userModel.bookAppointment(connection, data)
        .then(function (Details) {
          console.log(Details)
          deferred.resolve(Details)
        })
        .catch(function (error) {
          deferred.reject(error)
        })

    }
  })
  return deferred.promise

}

function updateUser (data) {
  var deferred = q.defer()
  dbConnection.getConnection(false, function (err, connection) {
    if (err) {
      throw ('DB ERROR OCCURED')
    } else {
      return userModel.updateUserDetails(connection, data)
        .then(function (Details) {
          console.log(Details)
          deferred.resolve(Details)
        })
        .catch(function (error) {
          deferred.reject(error)
        })
    }
  })
  return deferred.promise

}

function filterUsers (filterOption) {
  var deferred = q.defer()
  dbConnection.getConnection(false, function (err, connection) {
    if (err) {
      throw ('DB ERROR OCCURED')
    } else {
      return userModel.filterUserDetails(connection, filterOption)
        .then(function (Details) {
          deferred.resolve(Details)
        })
        .catch(function (error) {
          deferred.reject(error)
        })
    }
  })
  return deferred.promise
}

function updatePassword (data) {
  var deferred = q.defer()
  dbConnection.getConnection(false, function (err, connection) {
    if (!err) {
      return userModel.verifyTokenAndTime(connection, data)
        .then(function (result) {

          if (!result) {
            err = {
              message: 'SESSION EXPIREDD'
            }
            throw (err)
          }
          else {
            data.user_id = result.user_id
            data.password = utility.hashPassword(data.password)
            return userModel.updatePassword(connection, data)
          }
        })
        .then(function (result) {
          deferred.resolve(result)
        })
        .catch(function (err) {
          console.log(err)
          deferred.reject(err)
        })
    }
    else {
      deferred.reject(err)
    }
  })
  return deferred.promise
}

function getUserDetails (role) {
  var deferred = q.defer()
  dbConnection.getConnection(false, function (err, connection) {
    if (err) {
      throw Error('DB ERROR OCCURED')
    } else {
      if (role === 'doctor') {
        return userModel.getUserDetailsByRole(connection, role)
          .then(function (doctorsDetails) {
            deferred.resolve(doctorsDetails)
          })
          .catch(function (error) {
            deferred.reject(err)
          })
      } else if (role === 'allusers') {

        return userModel.getAllUser(connection)
          .then(function (userDetails) {
            deferred.resolve(userDetails)
          })
          .catch(function (error) {
            deferred.reject(err)
          })

      }
    }
  })
  return deferred.promise
}

function createUser (data) {
  var deferred = q.defer()
  dbConnection.getConnection(true, function (err, connection) {
    data.password = utility.hashPassword(data.password)
    data.createdDate = utility.current_datetime()
    var userId
    var roleId = getRoleId(data.role)
    if (err) {
      throw Error('DB ERROR OCCURED')
    }
    else {
       userModel.addUser(connection, data)
        .then(function (result) {
          console.log('user table updated')
          userId = result.insertId
          data.user_id = userId
          data.role_id = roleId
          return userModel.addUserDetails(connection, data)
        })
        .then(function (result) {
          console.log('user details table updated')
          userModel.adduserRole(connection, data)
        })
        .then(function (result) {

          if(data.role_id === 2){
            updateDoctorSpeciality(connection,data)
              .then(function (result) {
                console.log('role table updated')
                let res = {
                  status: 'success'
                }
                connection.commit()
                connection.release()
                deferred.resolve(res)
              })
              .catch(function(err){
                deferred.reject(err)
              })
          }else {
            console.log('role table updated')
            let res = {
              status: 'success'
            }
            connection.commit()
            connection.release()
            deferred.resolve(res)
          }
        })
        .catch(function (error) {
          console.log('inside main catch',error)
           deferred.reject(error)
        })
    }
  })
  return deferred.promise
}

function updateDoctorSpeciality (connection,data) {
  var deferred=q.defer();
  userModel.getSpecialityId(connection,data['speciality'])
    .then(function(result){
      if(!result){
        throw ('Error in doctor speciality')
      }
       userModel.addDoctorSpeciality(connection,data,result['speciality_id'])
    })
    .then(function(result){
        deferred.resolve(result)
    })
    .catch(function(err){
      deferred.reject(err);
    })
  return deferred.promise;
}

function getRoleId (role) {
  switch (role) {
    case 'admin' :
      return 1
      break
    case 'doctor' :
      return 2
      break
    case 'patient' :
      return 3
      break
    default:
      return 1
  }
}

router.post('/bookappointment', user.bookAppointment)
router.put('/updateprofile', user.updateProfile)
router.get('/filterBy', user.filterBy)
router.put('/updatepassword', user.resetPassword)
router.post('/adduser', user.addUser)
router.get('/getusers/:role', user.getUsers)
router.put('/updateAppointmentStatus/:status', user.updateAppointmentStatus)
router.delete('/deleteuser/:mailId', user.deleteUser)
router.get('/history/:userId', user.history)
module.exports = router