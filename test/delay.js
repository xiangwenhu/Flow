const ActivityFactory = require('../src/factory/ActivityFactory')
ActivityFactory.getDelayActivity(2000)
    .execute()
    .then(r => console.log(r))