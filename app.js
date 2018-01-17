const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const arduino = require('./arduino');

const index = require('./routes/index');

const app = express();

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
setInterval(readKeys, 10);


function readKeys () {
    arduino.readKeysFromArdA().then(data => {

        if (parseInt(data) < 900) {
            arduino.readValuesFromArdB().then(data => {

                if (data[0] !== undefined &&
                    data[1] !== undefined &&
                    data[2] !== undefined) {

                    arduino.writeValuesToArdA(data).then(data => {
                        console.log(data);
                    });

                }

            });
        }

    });
}


function saveToDatabase () {

    arduino.readValuesFromArdB().then(data => {

        if (data[0] !== undefined &&
            data[1] !== undefined &&
            data[2] !== undefined) {

            arduino.saveToDatabase(data);

        }

    });

}


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    const err = new Error('Not Found');
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
