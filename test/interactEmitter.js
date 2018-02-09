const factory = require('../src/factory/ActivityFactory'),
    connect = require('../src/connector/connect'),
    FlowInstance = require('../src/flow/FlowInstance')

const config = {
    type: 'sequence',
    name: '组合',
    children: [{
        type: 'code',
        name: '输出当前时间',
        code: 'console.log(new Date().toLocaleString())'
    },{
        type: 'interact',
        name: '获取参数',
        descriptor: {
            name: '名字',
            age: '年龄'
        }
    },{
        type: 'code',
        name: '输出res',
        code: 'console.log(res)'
    }]
}

const activity = factory.get(config)
const fInstance = new FlowInstance(activity)


fInstance.subscribeInteractRequest(function (activity, root) {
    if (root.instance === fInstance) {
        setTimeout(function () {
            fInstance.dispatchInteractReponse({
                time: 5
            })
        }, 3000)
    }
})


fInstance.start({}, {}).then(r => {
    console.log(r)
    console.log(new Date().toLocaleString())
})