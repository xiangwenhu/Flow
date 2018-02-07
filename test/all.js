const ActivityFactory = require('../src/factory/ActivityFactory')

const config = {
    type: 'all',
    children: [{
        type: 'sequence',
        children: [{
            type: 'delay',
            time: 3000
        }, {
            type: 'delay',
            time: 6000
        }]
    }, {
        type: 'delay',
        time: 4000
    }, {
        type: 'delay',
        time: 5000
    }]
}

console.log(new Date().toLocaleString())
ActivityFactory.get(config)
    .execute({})
    .then(r => console.log(new Date().toLocaleString()))