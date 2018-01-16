const nodemailer=require('nodemailer')

const dbConfig={
  host:'localhost',
  user:'root',
  password:'root',
  database:'healthcare',
  timezone: 'UTC+0',
  dateStrings : true
}

module.exports.dbConfig=dbConfig;
/* OR exports.dbConfig=dbConfig; */
//Mail configurations

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  secureConnection: false,
  port: 587,
  requiresAuth: true,
  domains: ["gmail.com", "googlemail.com"],
  auth: {
    user: 'maildId',
    pass: 'password'
  }
});
exports.transporter=transporter;

const healthCareAdmin={
  user: 'maildId',
    pass: 'password'
}
module.exports.healthCareAdmin=healthCareAdmin;

