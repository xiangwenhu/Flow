const {
    race,
    all,
    sequence
} = require('./promise/plus')
require('./activity/MongoActivity')


const p1 = function () {
        return new Promise((resolve, reject) => {
            setTimeout(function () {
                resolve(1)
            }, 1000)
        })
    },
    p2 = function () {
        return new Promise((resolve, reject) => {
            setTimeout(function () {
                resolve(2)
            }, 2000)
        })
    },
    p3 = function () {
        return new Promise((resolve, reject) => {
            setTimeout(function () {
                resolve(3)
            }, 3000)
        })
    }


function printTime() {
    console.log(new Date().toLocaleString(), ...arguments)
}

const promises = [p1, p2, p3]

sequence(promises, function (r, i, ...args) {
    console.log('result:' + r, 'index:' + i, 'args:' + args)
}, {
    a: 1,
    b: 2
},3).then(r => printTime('result:', r))