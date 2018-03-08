const {
    race,
    all,
    sequence
} = require('./utils/promisePlus')


const p1 = function () {
        return new Promise((resolve, reject) => {
            setTimeout(function () {
                printTime(1)
                resolve(1)
            }, 1000)
        })
    },
    p2 = function () {
        return new Promise((resolve, reject) => {
            setTimeout(function () {
                printTime(2)
                resolve(2)
            }, 2000)
        })
    },
    p3 = function () {
        return new Promise((resolve, reject) => {
            setTimeout(function () {
                printTime(3)
                resolve(3)
            }, 3000)
        })
    }


function printTime() {
    console.log(new Date().toLocaleString(), ...arguments)
}

const promises = [p1, p2, p3]

sequence(promises).then(r => printTime('result:', r))