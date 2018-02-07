const ActivityFactory = require('../src/factory/ActivityFactory')

const config = {
    type: 'race',
    children: [{
        type: 'sequence',
        children: [{
            type: 'delay',
            time: 1000
        }, {
            type: 'delay',
            time: 2000
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