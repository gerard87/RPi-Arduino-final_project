var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var storage = require('node-persist');
var exec = require('child_process').exec, child;

var index = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);


setInterval(saveToDatabase, 300000);

function saveToDatabase () {

    const command = './i2c_scripts/read_values';
    child = exec(command, function (error, stdout, stderr) {
        console.log(stdout);

        var array = stdout.split(",");

        if (array[0] !== undefined &&
            array[1] !== undefined &&
            array[2] !== undefined) {

            array[2] = array[2].replace(/\n/g, '');

            var sensors = [];
            sensors.push(array[0]);
            sensors.push(array[1]);
            sensors.push(array[2]);
            sensors.push(new Date().toLocaleString());

            storage.init().then(function () {

                storage.getItem('sensors').then(function (value) {

                    value.push(sensors);

                    storage.setItem('sensors', value).then(function () {
                        return storage.getItem('sensors');
                    }).then(function (value) {
                        console.log(value);
                    });

                }).catch(function () {

                    var value = [];
                    value.push(sensors);

                    storage.setItem('sensors', value).then(function () {
                        return storage.getItem('sensors');
                    }).then(function (value) {
                        console.log(value);
                    });
                });


            });

        }


    });

}


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
