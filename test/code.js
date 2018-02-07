const ActivityFactory = require('../src/factory/ActivityFactory')



ActivityFactory.getCodeActivity('ctx.count = 5')
    .execute({})
    .then(r =>
        console.log(r)
    )