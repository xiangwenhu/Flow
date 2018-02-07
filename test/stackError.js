const ActivityError = require('../src/error/ActivityError')


function testError() {

    throw ActivityError.fromError(new Error('ccc'), {
        type: 'what',
        name: '测试'
    })
}


function testError2() {
    testError()
}


var obg = {
    testError2
}


try {
    obg.testError2()
} catch (err) {
    console.log(err)
}



module.exports = {

}