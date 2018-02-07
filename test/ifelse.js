const ActivityFactory = require('../src/factory/ActivityFactory'),
    FlowManager = require('../src/flow/FlowManager')


const config = {
    type: 'ifelse',
    name: 'if else 测试',
    context: {
        count: 5
    },
    if: {
        assert: 'ctx.count  <= 5',
        name: '如果count小于5',
        children: [{
            type: 'delay',
            name: 'delay 5 秒',
            time: 1000
        }, {
            type: 'sequence',
            name: '连续睡觉',
            children: [{
                type: 'sequence',
                name: '连续睡觉二',
                children: [{
                    type: 'delay',
                    time: 2000,
                    name: '连续睡觉delay2000'
                }, {
                    type: 'delay',
                    time: 500
                }]
            }, {
                type: 'code',
                code: 'console.log("连续睡觉二 code Activity")'
            }, {

            }]
        }, {
            type: 'code',
            name: '输出当前时间',
            code: 'console.log(new Date().toLocaleString())'
        }]
    },
    elseif: [{
        assert: 'ctx.count <=10 ',
        name: '如果count小于10',
        children: [{
            type: 'delay',
            name: 'delay 10 秒',
            time: 10000
        }, {
            type: 'code',
            name: '输出当前时间',
            code: 'console.log(new Date().toLocaleString())'
        }]
    }, {
        assert: 'ctx.count <=15 ',
        name: '如果count小于15',
        children: [{
            type: 'delay',
            name: 'delay 15秒',
            time: 15000
        }, {
            type: 'code',
            name: '输出当前时间',
            code: 'console.log(new Date().toLocaleString())'
        }]
    }, {
        assert: 'ctx.count <=25 ',
        name: '如果count小于25',
        children: [{
            type: 'delay',
            name: 'delay 25秒',
            time: 25000
        }, {
            type: 'code',
            name: '输出当前时间',
            code: 'console.log(new Date().toLocaleString())'
        }]
    }],
    else: {
        children: [{
            type: 'delay',
            name: 'delay 50秒',
            time: 50000
        }, {
            type: 'code',
            name: '输出当前时间',
            code: 'console.log(new Date().toLocaleString())'
        }]
    }
}

const fInstance = FlowManager.getInstance()



const globalContext = {
    gCount: 5
}

console.log(new Date().toLocaleString())
const act = ActivityFactory.get(config)

try {
    fInstance.start(act, undefined, globalContext).
    catch(
        err => console.log('rrrr', err)
    )
} catch (err) {
    console.log('ttyty', err)
}

setTimeout(function () {
    fInstance.stop(act._id)
}, 3100)