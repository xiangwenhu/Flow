const ActivityFactory = require('../src/factory/ActivityFactory')
//const url = `http://www.sojson.com/open/api/weather/json.shtml?city=${encodeURIComponent('北京')}`
const url = 'https://www.baidu.com/'
ActivityFactory.getFetchActivity(url)
    .execute()
    .then(r => console.log(r))