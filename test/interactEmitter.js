const {
    interactEmitter
} = require('../src/common/emitter'),
    factory = require('../src/factory/ActivityFactory'),
    connect = require('../src/connector/connect')

const config = {
    type: 'interact',
    time: 5000,
    descriptor: {
        name: '名字',
        age: '年龄'
    }
}

console.log(new Date().toLocaleString())
// build Activity
const itA = factory.get(config)
// 链接
connect(itA, interactEmitter)

interactEmitter.onDeclare((id, descriptor) => {

    setTimeout(() => {
        interactEmitter.consumer(id, {
            name: 'My Name is 黎明',
            age: 14
        })
    }, 3000)
})


itA.execute({})
    .then(res => console.log(res))
    .then(() => console.log(new Date().toLocaleString())).catch(err => {
        console.log(new Date().toLocaleString())
        console.log('err', err)
    })