const ActivityFactory = require('../src/factory/ActivityFactory'),
    flowProgress = require('../src/flow/flowProgress')

const config = {
    type: 'sequence',
    name: '玛丽玛丽',
    children: [{
        type: 'code',
        code: 'console.log(new Datessss().toLocaleString())'
    }, {
        type: 'delay',
        time: 2000
    }, {
        type: 'code',
        code: 'console.log(new Date().toLocaleString())'
    }, {
        type: 'catch',
        code: 'ctx.count = 5',
        ignore: false,
        message: '爱爱的错误'
    }, {
        type: 'code',
        code: 'ctx.count +=  xxx/5'
    }, {
        type: 'code',
        code: 'console.log(JSON.stringify(ctx))'
    }, {
        type: 'catch',
        code: 'console.log("xx的错误")',
        ignore: false,
        message: 'xx'
    }]
}

const activity = ActivityFactory.get(config)



activity.execute({}).catch(err => {
    const c = activity
    console.log(err.toString())
})

const flow = flowProgress.getProgress(activity)

console.log(flow)