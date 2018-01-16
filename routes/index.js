const express = require('express');
const router = express.Router();
const storage = require('node-persist');
const arduino = require('../arduino');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Raspberry Pi' });
});

router.get('/read', function(req, res, next) {

    arduino.readValuesFromArdB().then(data => {

        if (data[0] !== undefined &&
            data[1] !== undefined &&
            data[2] !== undefined) {

            arduino.saveToDatabase(data);

            arduino.writeValuesToArdA(data).then(data => {
                console.log(data);
            });

        }

        res.render('read', {
            temperature: data[0],
            humidity: data[1],
            bpm: data[2]
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
