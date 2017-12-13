var baseDir = process.cwd()
var router = require('../common')
var userModel = require(baseDir + '/models/users/user')
var dbConnection = require(baseDir + '/services/mysql')
const q = require('q')
var utility = require(baseDir + '/utilities/utilityMethods')
var responseConstants=require(baseDir+'/utilities/constants/apiResponseConstants.js')
var user = {

  addUser: function (req, res) {
    console.log('inserting new user')
    var data = req.body
    res.setHeader('content-type', 'application/json')
    return createUser(data)
      .then(function (result) {
        console.log("RES : "+JSON.stringify(result))
        return res.send(result).end('');
      }).catch(function (err) {
        console.log("RES ERROR : "+err.code)

        if(err.code==='ER_DUP_ENTRY') {
          err.status=responseConstants.EMAIL_ALREADY_EXIST;
        }
        return res.send(JSON.stringify(err)).end('')
      })
  } ,
  getUsers : function(req,res){
    console.log("geeting information....");
    res.setHeader('content-type','application/json')
    var role=req.url.split('/')[2];
    return getUserDetails(role)
      .then(function (result) {
        res.status=responseConstants.success;
        console.log("RES : "+JSON.stringify(result))
        return res.send(result).end('');
      }).catch(function (err) {
        return res.send(JSON.stringify(err)).end('')
      })

  },

}

function getUserDetails (role) {
  var deferred=q.defer()

  dbConnection.getConnection(false,function (err,connection) {
    if(err){
      throw Error('DB ERROR OCCURED');
    } else{
          return userModel.getUserDetailsByRole(connection,role)
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

function createUser (data) {
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
            return userModel.addUserDetails(connection,data)
        })
        .then(function (result) {
          console.log("user details table updated")
               return userModel.adduserRole(connection, data)
        })
        .then(function (result) {
          console.log("role table updated")
          let res={
            status:'success'
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

function getRoleId (role) {
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

router.post('/adduser', user.addUser)
router.get('/getusers/doctor',user.getUsers)
module.exports = router