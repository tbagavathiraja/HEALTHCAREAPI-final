const crypto = require("crypto");

var momentTimeZone=require('moment-timezone');

exports.hashPassword = function(password) {
    return crypto.createHash('md5').update(password).digest("hex")
}

exports.add_minute_current_datetime = function(minute) {
    var currentDate = new Date();
    var updatedDate = new Date(currentDate.getTime() + (minute * 60 * 1000));
    return momentTimeZone(updatedDate).format('YYYY-MM-DD HH:mm:ss');
}
exports.current_datetime=function () {
  return momentTimeZone(new Date()).format('YYYY-MM-DD HH:mm:ss');
}

exports.format_date = function(date){
  return momentTimeZone(date).format('YYYY-MM-DD HH:mm:ss');
}