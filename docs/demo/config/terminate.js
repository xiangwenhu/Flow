{
    type: 'sequence',
    name: '玛丽玛丽',
    children: [{
        type: 'code',
        name: '输出当前时间',
        code: 'console.log(new Date().toLocaleString())'
    }, {
        type: 'delay',
        name: '延时2s',
        time: 2000
    }, {
        type: 'code',
        name: '输出当前时间',
        code: 'console.log(new Date().toLocaleString())'
    }, {
        type: 'catch',
        name: '错误捕捉',
        code: 'ctx.count = 5',
        ignore: false,
        message: '爱爱的错误'
    }, {
        type: 'terminate',
        name: '终止流程',
        message: '哈哈'
    }, {
        type: 'code',
        name: '输出上下文',
        code: 'console.log(JSON.stringify(ctx))'
    }, {
        type: 'catch',
        name: '错误捕捉',
        code: 'console.log("xx的错误")',
        ignore: false,
        message: 'xx'
    }]
}

