const TerminateActivity = require('../TerminateActivity')
module.exports = (factory, props) => act => {
    // 验证和过滤属性
    act = props(act)

    //Activity的构造函数
    const activity = new TerminateActivity(act.context)
    activity.name = act.name || activity.name
    activity.params()
    return activity
}