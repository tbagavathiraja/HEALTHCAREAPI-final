var baseDir = process.cwd()
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
                console.log("RES : " + JSON.stringify(result))
                return res.send(result).end('');
            }).catch(function (err) {
                console.log("RES ERROR : " + err.code)

                if (err.code === 'ER_DUP_ENTRY') {
                    err.status = responseConstants.EMAIL_ALREADY_EXIST;
                }
                return res.send(JSON.stringify(err)).end('')
            })
    },

    getUsers: function (req, res) {
        console.log("getting information....");
        res.setHeader('content-type', 'application/json')
        var role = req.url.split('/')[2];
        return getUserDetails(role)
            .then(function (result) {
                res.status = responseConstants.success;
                console.log("RES : " + JSON.stringify(result))
                return res.send(result).end('');
            }).catch(function (err) {
                return res.send(JSON.stringify(err)).end('')
            })

    },

    resetPassword: function (req, res) {
        console.log("updating password....");
        res.setHeader('content-type', 'application/json')
        var data = req.body;
        return updatePassword(data)
            .then(function (result) {
                res.status = responseConstants.success;
                result.status = responseConstants.SUCCESS;
                ;
                console.log("RES : " + JSON.stringify(result))
                return res.send(result).end('');
            }).catch(function (err) {
                err['status'] = responseConstants.FAILURE;
                return res.send(JSON.stringify(err)).end('')
            })
    },

    filterBy: function (req, res) {
        var filterOption = 'general';
        console.log('filtering user by ' + filterOption);
        res.setHeader('content-type', 'application/json');
        return filterUsers(filterOption)
            .then(function (result) {
                res.status = responseConstants.success;
                console.log("RES : " + JSON.stringify(result))
                return res.send(result).end('');
            }).catch(function (err) {
                return res.send(JSON.stringify(err)).end('')
            })
    } ,
  updateProfile: function (req,res) {
        console.log("updateing user...")
    var data = req.body
    res.setHeader('content-type', 'application/json')
    return updateUser(data)
      .then(function (result) {
        console.log("RES : " + JSON.stringify(result))
        result.status="success"
        return res.send(result).end('');
      }).catch(function (err) {
        return res.send(JSON.stringify(err)).end('')
      })

  } ,
  bookAppointment: function (req,res) {
    console.log("booking ...")
    var data = req.body
    res.setHeader('content-type', 'application/json')
    return getAppointment(data)
      .then(function (result) {
        console.log("RES : " + JSON.stringify(result))
        result.status="success"
        return res.send(result).end('');
      }).catch(function (err) {
        return res.send(JSON.stringify(err)).end('')
      })

  }

}

function getAppointment (data) {
  var deferred = q.defer();
  dbConnection.getConnection(false,function (err,connection) {
    if(err){
      throw ('DB Error occured')
    }else{

      return userModel.bookAppointment(connection,data)
        .then(function (Details) {
          console.log(Details)
          deferred.resolve(Details)
        })
        .catch(function (error) {
          deferred.reject(error)
        })

    }
  })
  return deferred.promise;

}

function updateUser (data) {
  var deferred = q.defer()
  dbConnection.getConnection(false, function (err, connection) {
    if (err) {
      throw ('DB ERROR OCCURED');
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
  });
  return deferred.promise;

}
function filterUsers(filterOption) {
    var deferred = q.defer()
    dbConnection.getConnection(false, function (err, connection) {
        if (err) {
            throw ('DB ERROR OCCURED');
        } else {
            return userModel.filterUserDetails(connection, filterOption)
                .then(function (Details) {
                    deferred.resolve(Details)
                })
                .catch(function (error) {
                    deferred.reject(error)
                })
        }
    });
    return deferred.promise;
}

function updatePassword(data) {
    var deferred = q.defer();
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
                        data.user_id = result.user_id;
                        data.password = utility.hashPassword(data.password)
                        return userModel.updatePassword(connection, data)
                    }
                })
                .then(function (result) {
                    deferred.resolve(result)
                })
                .catch(function (err) {
                    console.log(err)
                    deferred.reject(err);
                });
        }
        else {
            deferred.reject(err)
        }
    })
    return deferred.promise;
}


function getUserDetails(role) {
    var deferred = q.defer()
    dbConnection.getConnection(false, function (err, connection) {
        if (err) {
            throw Error('DB ERROR OCCURED');
        } else {
            return userModel.getUserDetailsByRole(connection, role)
                .then(function (doctorsDetails) {
                    deferred.resolve(doctorsDetails)
                })
                .catch(function (error) {
                    deferred.reject(err)
                })
        }
    })
    return deferred.promise;
}

function createUser(data) {
    var deferred = q.defer()
    dbConnection.getConnection(false, function (err, connection) {
        data.password = utility.hashPassword(data.password)
        data.createdDate = utility.current_datetime()
        var userId;
        var roleId = getRoleId(data.role)
        if (err) {
            throw Error('DB ERROR OCCURED')
        }
        else {
            return userModel.addUser(connection, data)
                .then(function (result) {
                    console.log("user table updated")
                    userId = result.insertId
                    data.user_id = userId
                    data.role_id = roleId;
                    return userModel.addUserDetails(connection, data)
                })
                .then(function (result) {
                    console.log("user details table updated")
                    return userModel.adduserRole(connection, data)
                })
                .then(function (result) {
                    console.log("role table updated")
                    let res = {
                        status: 'success'
                    }
                    connection.commit();
                    connection.release();
                    deferred.resolve(res);
                })
                .catch(function (error) {
                    return deferred.reject(error)
                })
        }
    })
    return deferred.promise
}

function getRoleId(role) {
    switch (role) {
        case 'Admin' :
            return 1
            break
        case 'Doctor' :
            return 2
            break
        case 'Patient' :
            return 3
            break
        default:
            return 1
    }
}

router.post('/bookappointment',user.bookAppointment)
router.put('/updateprofile',user.updateProfile)
router.get('/filterBy', user.filterBy)
router.put('/updatepassword', user.resetPassword)
router.post('/adduser', user.addUser)
router.get('/getusers/doctor', user.getUsers)
module.exports = router