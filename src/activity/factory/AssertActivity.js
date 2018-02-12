const AssertActivity = require('../AssertActivity')
module.exports = (factory, props) => act => {
    // 验证和过滤属性
    act = props(act)

    const activity = new AssertActivity(act.context, act.code)
    activity.name = act.name || activity.name
    activity.params()
    return activity
}