var mailer = require('nodemailer')
var q = require('q')
var baseDir = '/home/ionixx/WebstormProjects/HEALTHCAREAPI-final';
var router = require(baseDir + '/routes/common')
var dbConnection = require(baseDir + '/services/mysql')
var utility = require(baseDir + '/utilities/utilityMethods')
var userModel = require(baseDir + '/models/users/user')
var config = require(baseDir + '/config/config.js')
var email = {

  resetPassword: function (user) {
    var mailOptions = {
      from: '"HealthCare Admin " '+config.healthCareAdmin.user+'"',
      to: user.mail_id,
      subject: 'Healthcare Login Password Reset',
      text: 'Click the below link to reset your password ',
      html:"<h3>Hello "+user.name+"</h3><div >" +
      "<h4 style='color: green;border-radius: 20px'>You requested for resetting your password....click <strong><span style='background-color:white;color: red'>"+
      "<a href='"+user.reset_link+"'"+"> here</a>"+"</span></strong><h4> </div>"
    }

    config.transporter.verify(function(error, success) {
      if (error) {
        console.log(error);
      } else {
        console.log('Server is ready to take our messages');
      }
    });


    config.transporter.sendMail(mailOptions, function (err, info) {
      console.log('Entered')
      if (err) {
        console.log(err)
      } else {
        console.log('Email send : ' + info.rejected+" "+info.rejected.length+" "+typeof (info.rejected));
      }
    })
  }

}

module.exports = email





