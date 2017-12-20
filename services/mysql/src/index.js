var baseDir = process.cwd();
var mysql = require('mysql');
var config = require(baseDir + '/config/config.js');
let connectionObject = {};
let request_name = "";
mysqlUtilities = require('mysql-utilities')
var pool = mysql.createPool({
    host: config.dbConfig.host,
    user: config.dbConfig.user,
    password: config.dbConfig.password,
    database: config.dbConfig.database,
    debug   :  false
});

pool.on('connection', function(connection) {
  mysqlUtilities.upgrade(connection);
  mysqlUtilities.introspection(connection);
});

pool.on('acquire', function (connection) {
  connectionObject[connection.threadId] = request_name;
  /*console.error('Connection %d acquired : Total : %d, Free : %d',connection.threadId, pool._allConnections.length,
   pool._freeConnections.length,connectionObject);*/
});

pool.on('release', function (connection) {
  connectionObject[connection.threadId] = "";
/*  console.error('Connection %d released : Total : %d, Free : %d',connection.threadId, pool._allConnections.length,
    pool._freeConnections.length,connectionObject);*/
});


exports.connectionPool = pool;

exports.getConnection = function(transaction,callback) {
  if(typeof transaction == 'function'){
    callback = transaction;
    transaction = false;
  }
  request_name = ((new Error().stack).split("at ")[2]).trim();

  pool.getConnection(function(err,connection){
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
