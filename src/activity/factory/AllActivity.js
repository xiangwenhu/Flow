const AllActivity = require('../AllActivity')
module.exports = (factory, props) => act => {
    // 验证和过滤属性
    act = props(act)

    //Activity的构造函数
    let children = null
    if (Array.isArray(act.children)) {
        children = factory.getAll(act.children)
    }
    const activity = new AllActivity(act.context, children)
    activity.name = act.name || activity.name
    activity.params()
    return activity
}