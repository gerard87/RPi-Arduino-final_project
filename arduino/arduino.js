var exec = require('child_process').exec, child;
const storage = require('node-persist');

function readValuesFromArdB () {
    return new  Promise(function (resolve, reject) {
        const cmd = './i2c_scripts/read_values';
        child = exec(cmd, function (error, stdout, stderr) {

            const array = stdout.split(",");

            if (array[0] !== undefined &&
                array[1] !== undefined &&
                array[2] !== undefined) {

                array[2] = array[2].replace(/\n/g, '');

            }

            return resolve(array);

        });
    });
}

function writeValuesToArdA (data) {
    return new Promise(function (resolve, reject) {
        /* Send values to Arduino A LCD */
        const cmd = './i2c_scripts/write_values ' + data[0] + " , " + data[1] + " . " + data[2];
        child = exec(cmd, function (error, stdout, stderr) {
            return resolve(stdout);
        });
    });
}

function readKeysFromArdA () {
    return new  Promise(function (resolve, reject) {
        const cmd = './i2c_scripts/read_keys';
        child = exec(cmd, function (error, stdout, stderr) {
            return resolve(stdout);
        });
    });
}


function saveToDatabase (array) {

    const sensors = [];
    sensors.push(array[0]);
    sensors.push(array[1]);
    sensors.push(array[2]);
    sensors.push(new Date().toLocaleString('es-ES', { hour12: false }));

    storage.init().then(function () {

        storage.getItem('sensors').then(function (value) {

            value.push(sensors);

            storage.setItem('sensors', value).then(function () {
                return storage.getItem('sensors');
            }).then(function (value) {
                console.log(value);
            });

        }).catch(function () {

            const value = [];
            value.push(sensors);

            storage.setItem('sensors', value).then(function () {
                return storage.getItem('sensors');
            }).then(function (value) {
                console.log(value);
            });
        });


    });
}

module.exports = {
    readValuesFromArdB,
    writeValuesToArdA,
    readKeysFromArdA,
    saveToDatabase
};