var baseDir = process.cwd();
var mysql = require('mysql');
var config = require(baseDir + '/config/config.js');

var dbConnection = mysql.createConnection({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
});

exports.dbConnection = dbConnection;

/*
or

module.exports={

dbConnection=mysql.createConnection({
  host:config.host,
  user:config.user,
  password:config.password,
  database:config.database
});


}
 */
