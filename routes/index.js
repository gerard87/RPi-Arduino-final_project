var express = require('express');
var router = express.Router();
var exec = require('child_process').exec, child;

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Raspberry Pi' });
});

router.post('/readvalues', function (req, res) {
    const command = './i2c_scripts/read_values';
    child = exec(command, function (error, stdout, stderr) {
        console.log(stdout);
        res.send(stdout);
    });

});

module.exports = router;
