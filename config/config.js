const nodemailer=require('nodemailer')

const dbConfig={
  host:'localhost',
  user:'root',
  password:'root',
  database:'healthcare'
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
    user: 'bagavathiraja.t@ionixxtech.com',
    pass: 'tbagavathi0511'
  }
});
exports.transporter=transporter;

const healthCareAdmin={
  user: 'bagavathiraja.t@ionixxtech.com',
  pass: 'tbagavathi0511'
}
module.exports.healthCareAdmin=healthCareAdmin;

