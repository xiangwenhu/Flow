{
    type: 'sequence',
    name: 'break测试',
    children: [{
        type: 'code',
        name: '输出当前日期',
        code: 'console.log(new Date().toLocaleString())'
    }, {
        type: 'delay',
        name: '延时2秒',
        time: 2000
    }, {
        type: 'code',
        name: '输出当前日期',
        code: 'console.log(new Date().toLocaleString())'
    }, {
        type: 'catch',
        name: '错误捕捉',
        code: 'ctx.count = 5',
        ignore: false,
        message: '爱爱的错误'
    }, {
        type: 'sequence',
        name: 'break测试',
        children: [{
            type: 'code',
            name: '输出11111',
            code: 'console.log(11111)'
        }, {
            type: 'delay',
            name: '延时4秒',
            time: 4000
        }, {
            type: 'break',
            name: '跳出break测试',
            message: '哈喽'
        }, {
            type: 'code',
            name: '输出22222',
            code: 'console.log(22222)'
        }]
    }, {
        type: 'code',
        name: '输出33333',
        code: 'console.log(33333)'
    }, {
        type: 'delay',
        name: '延时5秒',
        time: 5000
    }]
}