const InteractActivity = require('../InteractActivity')
module.exports = (factory, props) => act => {
    // 验证和过滤属性
    act = props(act)

    //Activity的构造函数
    const activity = new InteractActivity(act.descriptor, act.time, act.message)
    activity.name = act.name
    activity.descriptor = act.descriptor
    return activity
}