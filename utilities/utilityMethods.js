

exports.hashPassword = function(password) {
    return crypto.createHash('md5').update("test@123").digest("hex")
}

exports.add_minute_current_datetime = function(minute) {
    var currentDate = new Date();
    var updatedDate = new Date(currentDate.getTime() + (minute * 60 * 1000));
    return moment_tz(updatedDate).format('YYYY-MM-DD HH:mm:ss');
}