 {
    type: 'race',
    name:'race测试',
    children: [{
        type: 'sequence',
        name: '孩子们',
        children: [{
            type: 'delay',
            name: '延时1s',
            time: 1000
        }, {
            type: 'delay',
            name: '延时2s',
            time: 2000
        }]
    }, {
        type: 'delay',
        name: '延时4s',
        time: 4000
    }, {
        type: 'delay',
        name: '延时5s',
        time: 5000
    }]
}
