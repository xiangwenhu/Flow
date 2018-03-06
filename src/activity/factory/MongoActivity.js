const MongoActivity = require('../MongoActivity')
module.exports = (factory, props) => act => {
    // 验证和过滤属性
    act = props(act)

    //Activity的构造函数
    const activity = new MongoActivity(act.context, act.auth, act.commands)
    activity.name = act.name
    return activity
}