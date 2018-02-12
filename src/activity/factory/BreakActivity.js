const BreakActivity = require('../BreakActivity')
module.exports = (factory, props) => act => {
    // 验证和过滤属性
    act = props(act)

    const activity = new BreakActivity(act.context)
    activity.name = act.name || activity.name
    activity.params(act.message)
    return activity
}