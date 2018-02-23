 {
    type: 'while',
    name: '如果ctx.count小于5，加加',
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