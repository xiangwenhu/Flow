const ActivityFactory = require('../src/factory/ActivityFactory')

const config = {
    type: 'while',
    context: {
        count: 1
    },
    assert: 'ctx.count < 5',
    children: [{
        type: 'code',
        name: 'count加1',
        code: 'ctx.count++'
    }, {
        type: 'delay',
        name: '睡2s',
        time: 1500
    }, {
        type: 'code',
        name: '输出count',
        code: 'console.log("count:" + ctx.count)'
    }]
}

const w = ActivityFactory.get(config)



w.execute({
    count: 0
})