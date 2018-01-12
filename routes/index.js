var express = require('express');
var router = express.Router();
var exec = require('child_process').exec, child;

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Raspberry Pi' });
});

router.get('/read', function(req, res, next) {
    const command = './i2c_scripts/read_values';
    child = exec(command, function (error, stdout, stderr) {
        console.log(stdout);
        var array = stdout.split(",");
        res.render('read', {
            temperature: array[0],
            humidity: array[1],
            bpm: array[2]
        });
    });

});

module.exports = router;
