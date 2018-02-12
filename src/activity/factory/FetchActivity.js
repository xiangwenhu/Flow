const FetchActivity = require('../FetchActivity')
module.exports = (factory, props) => act => {
    // 验证和过滤属性
    act = props(act)

    //Activity的构造函数
    const activity = new FetchActivity(act.context)
    activity.name = act.name || activity.name
    activity.params(act.url, act.options, act.withHeaders)
    return activity
}