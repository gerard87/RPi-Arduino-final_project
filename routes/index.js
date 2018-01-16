var express = require('express');
var router = express.Router();
var exec = require('child_process').exec, child;
var storage = require('node-persist');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Raspberry Pi' });
});

router.get('/read', function(req, res, next) {

    /* Get values from Arduino B */
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

            /* Save values to database */
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



            /* Send values to Arduino A LCD */
            const cmd = './i2c_scripts/write_values ' + array[0] + " , " + array[1] + " . " + array[2];
            child = exec(cmd, function (error, stdout, stderr) {
                console.log(stdout);
            });


        }

        res.render('read', {
            temperature: array[0],
            humidity: array[1],
            bpm: array[2]
        });
    });

});


router.get('/history', function(req, res, next) {

    /* Get all values from database */
    storage.init().then(function () {
        storage.getItem('sensors').then(function (values) {
            console.log(values);
            if(values === undefined) values = [];
            res.render('history', { sensors: values });
        });
    });


});



module.exports = router;
