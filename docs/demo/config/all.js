{
    type: 'all',
    name: 'all测试',
    children: [{
        type: 'sequence',
        name: '延时组',
        children: [{
            type: 'delay',
            name: '延时3S',
            time: 3000
        }, {
            type: 'delay',
            name: '延时6S',
            time: 6000
        }]
    }, {
        type: 'delay',
        name: '延时4S',
        time: 4000
    }, {
        type: 'delay',
        name: '延时5S',
        time: 5000
    }]
}
