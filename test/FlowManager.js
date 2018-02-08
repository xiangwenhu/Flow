const FlowManager = require('../src/flow/FlowManager'),
    ActivityFactory = require('../src/factory/ActivityFactory')

const config = {
    type: 'all',
    name: '全部High起来',
    children: [{
        type: 'sequence',
        name: 'all的第一个sequence',
        children: [{
            type: 'delay',
            time: 1000
        }, {
            type: 'delay',
            name: '我要睡2s',
            time: 2000
        }, {
            type: 'code',
            name: '输出ssss',
            code: 'console.log("ssss")'
        }]
    }, {
        type: 'delay',
        name: '睡觉4s',
        time: 4000
    }, {
        type: 'delay',
        name: '睡觉5s',
        time: 5000
    }, {
        type: 'code',
        code: '5',
        name: 'code 5'
    }]
}

const activity = ActivityFactory.get(config),
    manager = FlowManager.getInstance(),
    fInstance = manager.create(activity)


fInstance.subscribe(function (activity, root) {

    console.log(activity.name, root.name)
})

fInstance.start({})
    .then(res =>
        console.log(res)
    ).catch(err => {
        console.log(err)
    })

setTimeout(function () {
    fInstance.stop('滚蛋，停')
}, 1000)