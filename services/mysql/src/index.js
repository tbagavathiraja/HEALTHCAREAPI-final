var baseDir = process.cwd();
var mysql = require('mysql');
var config = require(baseDir + '/config/config.js');
let connectionObject = {};
let request_name = "";
mysqlUtilities = require('mysql-utilities')
var connectionPool = mysql.createPool({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database,
    debug   :  false
});

connectionPool.on('connection', function(connection) {
  mysqlUtilities.upgrade(connection);
  mysqlUtilities.introspection(connection);
});

connectionPool.on('acquire', function (connection) {
  connectionObject[connection.threadId] = request_name;
  /*console.error('Connection %d acquired : Total : %d, Free : %d',connection.threadId, connectionPool._allConnections.length,
    connectionPool._freeConnections.length,connectionObject);*/
});

connectionPool.on('release', function (connection) {
  connectionObject[connection.threadId] = "";
/*  console.error('Connection %d released : Total : %d, Free : %d',connection.threadId, connectionPool._allConnections.length,
    connectionPool._freeConnections.length,connectionObject);*/
});


exports.connectionPool = connectionPool;

exports.getConnection = function(transaction,callback) {
  if(typeof transaction == 'function'){
    callback = transaction;
    transaction = false;
  }
  request_name = ((new Error().stack).split("at ")[2]).trim();

  connectionPool.getConnection(function(err,connection){
    if (err) {
      if(connection) {
        connection.release();
      }
      return callback(err,connection);
    }else{

      connection.connect();
      if(transaction) {
        connection.beginTransaction(function (err) {
          if (err) {
            return callback(err, connection);
          }else{
            callback(null,connection);
          }
        });
      }else{
        callback(null,connection);
      }

    }
  });

};
