var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var baseDir = process.cwd();

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

loadMiddlewares();


function loadMiddlewares() {
    var middlewareFile = require(baseDir+'/middlewares/middleware');

    middlewareFile.middlewareList.forEach(function (middleware) {
        app.use(middleware.run);
    });
}
app.use(require(baseDir+'/routes'));

app.listen(function () {
    console.log("Express app listenig on port 5800");
})

module.exports = app;
