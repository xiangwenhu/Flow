const CatchActivity = require('../CatchActivity')
module.exports = (factory, props) => act => {
    // 验证和过滤属性
    act = props(act)

    const activity = new CatchActivity(act.context)
    activity.params(act.message, act.code, act.ignore)
    activity.name = act.name || activity.name
    return activity
}