{
    type: 'ifelse',
    name: 'if else 测试',
    context: {
        count: 5
    },
    if: {
        assert: 'ctx.count  <= 5',
        name: '如果count小于等于5',
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
                name: '输出连续睡觉二 code Activity',
                code: 'console.log("连续睡觉二 code Activity")'
            }]
        }, {
            type: 'code',
            name: '输出当前时间',
            code: 'console.log(new Date().toLocaleString())'
        }]
    },
    elseif: [{
        assert: 'ctx.count <=10 ',
        name: '如果count小于等于10',
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
        name: '如果count小于等于15',
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
        name: '如果count小于等于25',
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
        name: '如果count大于25',
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
